---
description: Infra conventions — Azure Pipelines templates, Terraform layout & naming, per-environment variables, and local Docker dev.
applyTo: "azure-pipelines.yml,azure-pipeline/**/*.yml,terraform/**/*.{tf,tfvars},frontend/docker-compose.yml,frontend/entrypoint.sh,frontend/example.env"
---

# Infrastructure & CI/CD

Scope: everything that provisions, builds, or deploys the app outside the React source tree.

- **Azure Pipelines** — root `azure-pipelines.yml` + templates under `azure-pipeline/`.
- **Terraform** — HCL under `terraform/`, per-env tfvars under `terraform/env/`.
- **Local dev container** — `frontend/docker-compose.yml`, `frontend/entrypoint.sh`, `frontend/example.env`.

Complementary files (do not repeat their content here):
- [typescript.instructions.md](typescript.instructions.md) — where `VITE_*` variables are typed as ambient `__X__` defines in `vite-env.d.ts`.

This is a **frontend-only, static-site** infra: Vite build → Azure Storage `$web` container → Azure CDN endpoint. There is no backend service to deploy.

---

## Layout at a glance

```
azure-pipelines.yml                  <-- entry point: trigger, name, variable group, stage skeleton
azure-pipeline/
  environments_loop.yml              <-- per-env stage template (dev, qa, uat, staging, prod)
  build_frontend.yml                 <-- Node/Yarn build job
  terraform_plan.yml                 <-- Terraform plan job (wraps terraform_steps)
  terraform_steps.yml                <-- init + validate + plan|apply steps (shared)
  deploy_frontend.yml                <-- Terraform apply + blob upload + CDN purge (deployment job)
  deploy_validation.yml              <-- prod-only ManualValidation@0 gate

terraform/
  provider.tf                        <-- azurerm provider + backend
  main.tf                            <-- storage account (static site) + CDN profile/endpoint + rules
  variables.tf                       <-- environment, project_short_name
  env/
    dev.tfvars                       <-- environment = "dev"
    qa.tfvars
    uat.tfvars
    staging.tfvars
    prod.tfvars

frontend/
  docker-compose.yml                 <-- optional local dev in Docker (Node 20.11.1)
  entrypoint.sh                      <-- corepack enable && yarn install && yarn dev
  example.env                        <-- template of the VITE_* variables the app needs
```

---

## Azure Pipelines conventions

### The root file stays skeletal

`azure-pipelines.yml` **only** declares:

- `trigger:` — branches that fire the pipeline (currently `releases/*`).
- `name:` — build number pattern (`v0.01$(Rev:.rr)`).
- `variables: - group: web-react-skeleton-azure` — the global library.
- Top-level `stages:` — the PR-build stage plus a single `- template: azure-pipeline/environments_loop.yml` invocation.

Everything else lives in templates. Do not add jobs, scripts, or resource declarations directly to the root file.

### One template per concern, always parameterized

Every file in `azure-pipeline/` starts with a `parameters:` block declaring **typed** inputs. Consumers pass values via `template:` + `parameters:`. Reference: [azure-pipeline/build_frontend.yml](azure-pipeline/build_frontend.yml).

```yaml
parameters:
  - name: environment
    type: string
  - name: commandOptions      # optional pass-through
    type: string
  - name: depends_on          # optional dependency list
    type: object
    default: ""
```

Rules:
- **Typed parameters** (`string`, `object`, `boolean`, `number`) — never rely on implicit stringification.
- **Optional parameters have a `default`.** The `depends_on: ""` sentinel is the repo's convention for "no explicit deps"; the consumer template guards with `${{ if ne(parameters.depends_on, '') }}:`.
- **No template reaches directly into `variables['...']` from outside its parameters and library groups.** If a template needs a value, it comes in through `parameters:` or through a library variable it explicitly imports.

### Naming: job IDs, display names, artifacts

Follow the existing suffixed pattern so downstream `dependsOn:` references resolve:

| Kind | Pattern | Example |
| --- | --- | --- |
| Job / deployment ID | `<Verb>_<Thing>_${{ parameters.environment }}` | `Build_Frontend_dev`, `Terraform_Plan_qa`, `Deploy_Frontend_prod` |
| Stage ID | `Deploy_${{ environment }}` | `Deploy_dev` |
| Display name | `<Verb> <Thing> [${{ parameters.environment }}]` | `"Build Frontend [dev]"` |
| Build artifact | `build_frontend_${{ parameters.environment }}` | `build_frontend_prod` |

Rules:
- **Job ID = display name minus spaces/brackets, prefixed with the verb, environment as suffix.** Downstream `dependsOn:` uses the ID, not the display name.
- **Environment suffix everywhere** — even in single-env stages. Removing it breaks the loop.
- **Never omit the `[env]` display suffix** — the DevOps UI lists dozens of jobs; the suffix is how humans distinguish them.

### Environments loop is the extension point

Adding, removing, or reordering environments happens in **one place**: the `environments` parameter default in [azure-pipeline/environments_loop.yml](azure-pipeline/environments_loop.yml).

```yaml
parameters:
  - name: environments
    type: object
    default:
      - dev
      - qa
      # - uat
      # - staging
      # - prod
```

Rules:
- **Uncomment an environment here to enable it.** No other pipeline file needs a change.
- **A matching `terraform/env/<env>.tfvars` file must exist** before the env is enabled. Missing tfvars fails at plan time.
- **A matching `web-react-skeleton-<env>` library must exist in Azure DevOps** before the env is enabled — the loop imports it via `- group: "web-react-skeleton-${{ environment }}"`. Missing group fails at variable-expansion time.
- **Order in the list = order of deployment**, top to bottom. Keep prod last.
- **Only prod gets `deploy_validation.yml`**, via the inline `${{ if eq(environment, 'prod') }}:` conditional in the loop. Add other manual gates the same way — never fork the loop template.

### Variable groups & secrets

Two library groups back the pipeline:

| Group | Scope | Contents |
| --- | --- | --- |
| `web-react-skeleton-azure` | Global (loaded at root) | `PROJECT_SHORT_NAME`, `ARM_SERVICE_CONNECTION_NAME` |
| `web-react-skeleton-<env>` | Per env (loaded in the loop) | `api-url-<env>`, `ga-tracking-id-<env>` and any per-env secret |

Rules:
- **Never hardcode env-specific values in yaml.** URLs, tracking IDs, subscription IDs, keys all come from the per-env library.
- **Never inline secrets.** If a secret is added, mark it as secret in the library UI so it doesn't print in logs.
- **Reference library variables as `$(variable-name)`** — the kebab-case names in the library map to the same tokens.
- **`PROJECT_SHORT_NAME` shows up in `-var="project_short_name=$(PROJECT_SHORT_NAME)"`** — Terraform doesn't know about pipeline variables, so bridge them through `commandOptions`.
- **New env-specific value?** Add it to the library **before** the pipeline references it; expanding a missing variable fails the run with a cryptic message.

### Terraform steps are shared

`terraform_steps.yml` is the single source of truth for how Terraform runs. Both `terraform_plan.yml` and `deploy_frontend.yml` include it, differing only in `lastCommand: "plan"` vs `"apply"`.

```yaml
- template: terraform_steps.yml
  parameters:
    environment: ${{ parameters.environment }}
    commandOptions: ${{ parameters.commandOptions }}
    lastCommand: "plan"    # or "apply"
```

Rules:
- **Do not duplicate `TerraformInstaller@1` / `TerraformTaskV4@4` blocks** in other templates. Always go through `terraform_steps.yml`.
- **Terraform version is pinned** to `1.9.2` in the installer step. Bumping it is a deliberate change with a state-migration checklist (see [Terraform](#terraform)).
- **Backend key is per env**: `backendAzureRmKey: "${{ parameters.environment }}.tfstate"`. Never share state across envs.
- **Backend resource group / storage / container are hardcoded** to `rg-global-$(PROJECT_SHORT_NAME)` / `wrstfstorage` / `tfstate`. This mirrors `terraform/provider.tf`; the two must stay in sync.
- **Add new commands (e.g., `destroy`) by extending `lastCommand`**, not by creating a parallel step template.

### The build job — env vars are the interface to Vite

[azure-pipeline/build_frontend.yml](azure-pipeline/build_frontend.yml) sets `VITE_*` variables in a `variables:` block, then runs `yarn build`. Vite bakes them into the bundle at build time via `define` (see [frontend/vite.config.ts](frontend/vite.config.ts) and the `__ENV__` / `__API_URL__` / `__VERSION_NUMBER__` / `__GA_TRACKING_ID__` ambient types).

| Pipeline var | Source | Vite `define` | Consumer in code |
| --- | --- | --- | --- |
| `VITE_VERSION_NUMBER` | `$(Build.BuildNumber)` | `__VERSION_NUMBER__` | `Home.tsx` |
| `VITE_ENV` | pipeline literal (`dev`, `qa`, …) | `__ENV__` | `DebugBanner`, gates |
| `VITE_API_URL` | `$(api-url-<env>)` library | `__API_URL__` | `axiosInstance` |
| `VITE_GA_TRACKING_ID` | `$(ga-tracking-id-<env>)` library | `__GA_TRACKING_ID__` | analytics init |
| `VITE_GENERATE_SOURCEMAP` | pipeline literal (`false`) | Vite build option | build only |

Rules:
- **One build per environment.** These values are baked in — you cannot promote a `dev` artifact to `prod`.
- **New `VITE_*` variable?** Wire it in *three* places or it silently no-ops:
  1. Add to `frontend/example.env` (for local dev discoverability).
  2. Add to `frontend/vite.config.ts` `define:` block **and** typedef in [frontend/src/vite-env.d.ts](frontend/src/vite-env.d.ts).
  3. Add to `build_frontend.yml`'s `variables:` block, sourcing from the appropriate library entry.
- **Node version is pinned to `22.x`.** Bumping it is a coordinated change with local dev (`docker-compose.yml` uses `node:20.11.1` — keep the intent aligned or note the gap).
- **Yarn stable via corepack** — never call `npm install` in a pipeline step; the repo is Yarn-only.

### Deployment job specifics

[azure-pipeline/deploy_frontend.yml](azure-pipeline/deploy_frontend.yml):

- **`deployment:` (not `job:`)** — enables Azure Environments features (approvals, checks, deployment history).
- **`environment: ${{ parameters.environment }}`** — matches the DevOps Environment name (create it in DevOps before enabling the env).
- **`strategy.runOnce.deploy.steps:`** — the deploy strategy. Do not switch to `canary` / `rolling` without a rewrite; the storage-blob upload is not idempotent across strategies.
- **`pool: vmImage: "windows-latest"`** — required for the CDN Azure CLI commands as configured. Other jobs use `ubuntu-latest`; keep them there.
- **Post-Terraform steps**: empty the `$web` container, upload the build artifact, then purge the CDN. All three must succeed for a deploy to be considered complete.

Rules:
- **Never skip the CDN purge** — Azure CDN caches aggressively; users see stale JS/CSS for hours otherwise. If you split deploy, keep purge in the same pipeline.
- **Blob upload uses `az storage blob upload-batch`** with the built artifact path, not `azcopy`. Consistency across envs matters.
- **`addSpnToEnvironment: true`** on the AzureCLI task exposes the service principal to the inline script; leave it on for the blob step.

### Prod validation

`deploy_validation.yml` is a `pool: server` `ManualValidation@0` job with 60 min timeout. Only prod triggers it. If a future stakeholder wants a QA gate too, extend the loop's `${{ if eq(environment, 'prod') }}:` conditional to `${{ if or(eq(environment, 'prod'), eq(environment, 'staging')) }}:` — do not add a second validation template.

---

## Terraform

### Provider & backend

[terraform/provider.tf](terraform/provider.tf) pins:

- `azurerm` provider version `3.111.0`.
- Backend `azurerm` — RG `rg-global-<project>`, storage `wrstfstorage`, container `tfstate`, key `terraform.tfstate` (overridden per env by the pipeline).
- `features {}` (empty) and `skip_provider_registration = true` — do not enable provider auto-registration; the AzurePipelines doc lists the manual `az provider register` command when a new namespace is needed.

Rules:
- **Pin provider versions.** Never widen to `~> 3.111` or leave unpinned. Version bumps are their own PR.
- **When bumping the provider**, run `terraform plan` against every env before merging (loop lists them). Some minor bumps require state migration.
- **Backend values in `provider.tf` and `terraform_steps.yml` must match.** Change both together.
- **Resource groups (`rg-<env>-<project>`, `rg-global-<project>`) are NOT managed by Terraform** — they are provisioned out of band and consumed via `data "azurerm_resource_group"`. See [doc/AzurePipelines.md](doc/AzurePipelines.md#resource-groups-for-each-deployment-environment). If a new env is added, its resource group has to be created in Azure first.

### Variables — small, closed set

[terraform/variables.tf](terraform/variables.tf) declares two variables:

- `environment` — supplied by `env/<env>.tfvars`.
- `project_short_name` — supplied by the pipeline via `-var="project_short_name=$(PROJECT_SHORT_NAME)"`.

Rules:
- **Do not add variables that duplicate what the pipeline can inject.** Keep the interface narrow: one env identifier, one project identifier.
- **`env/<env>.tfvars` today only contains `environment = "<env>"`.** Add real per-env overrides here (e.g., a per-env SKU) rather than baking them into `main.tf` with `count`/`for_each` on the env string.
- **Never `terraform.tfvars` or default-file naming** — always the explicit `-var-file=env/<env>.tfvars` from the loop.

### Naming convention (Azure resources)

All resources follow `<abbrev>-<env>-<project_short_name>`, except when Azure's naming rules force a different shape:

| Resource | Pattern | Notes |
| --- | --- | --- |
| Resource group (data) | `rg-<env>-<project>` | Not managed by TF. |
| Resource group (global, data) | `rg-global-<project>` | Not managed by TF. |
| Storage account | `sa<project><env>` | Storage account names: 3–24 lowercase alphanumeric, no dashes. |
| CDN profile | `cdnp-<env>-<project>` | |
| CDN endpoint | `cdne-<env>-<project>` | |

Rules:
- **Always interpolate both `${var.environment}` and `${var.project_short_name}`** into resource names. Hardcoded names break the multi-env loop.
- **Storage account names have no dashes and are lowercase.** If `PROJECT_SHORT_NAME` contains dashes or uppercase, sanitize it in the pipeline before it reaches TF — don't add `replace()` inside `main.tf`.
- **Follow the abbreviation set** used by the Azure Cloud Adoption Framework (`rg`, `sa`, `cdnp`, `cdne`, `kv`, `vnet`, `pip`, `nsg`, …). Do not invent new prefixes.

### Tags — required on every resource

Every managed resource carries the same tag block:

```hcl
tags = {
  description = "Managed by Terraform"
  environment = var.environment
}
```

Rules:
- **`description = "Managed by Terraform"` is a boundary marker.** If a resource does not have it, either it isn't managed by TF or it should be — verify before touching it manually in Azure.
- **`environment` tag mirrors the variable.** Do not hardcode; do not omit.
- **Additional tags are welcome** (owner, cost center) but the two above are non-negotiable.

### CDN rules — SPA-aware, don't reorder blindly

[terraform/main.tf](terraform/main.tf)'s `azurerm_cdn_endpoint.default` has three delivery rules in a specific `order`:

1. **`EnforceHTTPS` (order 1)** — redirect HTTP → HTTPS.
2. **`SPArewrite` (order 2)** — rewrite extensionless URLs (`/dashboard`) to `/index.html` so the React router handles them, except `/404`.
3. **`SecurityHeader` (order 3)** — appends `X-Frame-Options: DENY`, `Strict-Transport-Security`, `X-Content-Type-Options: nosniff`.

Rules:
- **Order matters.** HTTPS enforcement runs first so the rewrite and headers apply to the redirected request. Do not renumber without understanding the effect on precedence.
- **New security header? Extend the `SecurityHeader` rule**, do not add a fourth rule at order 4 with only one header — keeps the ruleset scannable.
- **New route family that must not be rewritten?** Add another `request_uri_condition` to the `SPArewrite` rule (like the existing `/404` exclusion), not a new rule.
- **CSP is not configured today.** Adding one is a conscious choice — Pigment-CSS is compile-time so `'unsafe-inline'` is not needed for styles; still, coordinate with any inline `<script>` usage.

### Adding a new resource — checklist

1. Decide whether the resource group exists (data lookup) or needs external creation (extend the doc, not the TF).
2. Name it per the abbreviation table with `${var.environment}` and `${var.project_short_name}`.
3. Add the standard `tags` block.
4. If the resource needs env-specific settings, add them to `env/<env>.tfvars` and declare the variable in `variables.tf`.
5. If any new provider namespace is needed, list the `az provider register` command in [doc/AzurePipelines.md](doc/AzurePipelines.md#possible-issues).
6. Run `terraform plan` locally against `dev.tfvars` before pushing.
7. Merge to a `releases/*` branch — the loop will plan on every enabled env; verify each plan output before approving prod.

---

## Frontend env — the `VITE_*` contract

[frontend/example.env](frontend/example.env) is the source of truth for what the frontend needs at runtime:

```env
VITE_PORT=8080
VITE_GENERATE_SOURCEMAP=true
VITE_ENV=local
VITE_VERSION_NUMBER=v0.0.1
VITE_API_URL=<API_URL>
VITE_GA_TRACKING_ID=<GA_TRACKING_ID>
VITE_DOCKER=false
```

Rules:
- **`VITE_*` prefix is mandatory.** Vite only exposes prefixed vars to the client (and to the `define:` block).
- **Keep `example.env` in sync with `vite.config.ts`.** If you add a `define:` mapping in Vite, add its `VITE_*` source to `example.env` **and** to `build_frontend.yml`.
- **Never commit a real `.env`.** Only `example.env` is tracked.
- **`VITE_DOCKER=true`** flips Vite to bind on `0.0.0.0` (see the Docker section below). Leave it `false` for local non-Docker dev.

---

## Local Docker dev

Optional path for contributors who don't want Node installed locally. Reference: [frontend/docker-compose.yml](frontend/docker-compose.yml), [frontend/entrypoint.sh](frontend/entrypoint.sh).

- `docker compose up` from `frontend/` mounts the source tree, runs `entrypoint.sh` (`corepack enable && yarn install && yarn dev`), and exposes port `8000`.
- Node version in the container is `20.11.1` — historical, older than the pipeline's `22.x`. Do not "fix" one without the other; align with the team first.
- Requires `.env` next to `docker-compose.yml` with `VITE_DOCKER=true` so Vite binds to `0.0.0.0` and is reachable from the host.

Rules:
- **Docker is a dev convenience, not the deploy target.** The production build ships static files; no container runs in prod.
- **Do not add production build stages to `docker-compose.yml`.** New services (mock API, storybook) belong there; production tooling does not.

---

## Common mistakes and how to fix them

### 1. Hardcoding env-specific values in yaml

```yaml
# Bad — locks the value to the file
- name: VITE_API_URL
  value: "https://api.dev.example.com"
```

```yaml
# Good — sourced from the per-env library
- name: VITE_API_URL
  value: "$(api-url-${{ parameters.environment }})"
```

### 2. Enabling an env without its tfvars / library

Symptom: run fails with `env/uat.tfvars: no such file` or `variable group 'web-react-skeleton-uat' does not exist`.

Fix: create `terraform/env/uat.tfvars`, create the DevOps library, then uncomment `uat` in `environments_loop.yml`.

### 3. Managing resource groups in Terraform

```hcl
# Bad — the pipeline expects RGs to exist before TF runs
resource "azurerm_resource_group" "rg_env" {
  name     = "rg-${var.environment}-${var.project_short_name}"
  location = "canadacentral"
}
```

```hcl
# Good
data "azurerm_resource_group" "rg_env" {
  name = "rg-${var.environment}-${var.project_short_name}"
}
```

### 4. Adding a `VITE_*` variable only in `build_frontend.yml`

Symptom: variable set at build time but `undefined` in the bundle. Fix: add the mapping to `vite.config.ts` `define:` and type it in `vite-env.d.ts`. See the three-step wiring in [Env vars are the interface to Vite](#the-build-job--env-vars-are-the-interface-to-vite).

### 5. Skipping the CDN purge after deploy

Symptom: stale JS after a release, sometimes for hours. Fix: keep the `az cdn endpoint purge` step in `deploy_frontend.yml`. Never comment it out to "speed up" a deploy.

### 6. Widening a provider version pin

```hcl
# Bad — silent minor bumps between deploys
version = "~> 3.111"
```

```hcl
# Good — deliberate, reproducible
version = "3.111.0"
```

### 7. Missing `tags` on a new resource

Symptom: audit tools flag "unmanaged" resources; cost reports miss the env dimension. Fix: copy the standard `tags` block onto every `resource "azurerm_..."`.

### 8. Adding a manual gate as a new template instead of extending the loop

```yaml
# Bad — a parallel loop file for prod
- template: prod_only_environments_loop.yml
```

```yaml
# Good — extend the existing conditional
- ${{ if or(eq(environment, 'prod'), eq(environment, 'staging')) }}:
    - template: deploy_validation.yml
      parameters: { environment: ${{ environment }}, depends_on: [ Terraform_Plan_${{ environment }} ] }
```

### 9. `dependsOn:` referencing a job that isn't in the current env

Symptom: prod-only `Deploy_Validation_dev` is referenced in a `depends_on` list; the run fails with "unknown dependency" for dev. Fix: gate the entry in the `depends_on` object the same way the job itself is gated (see the `${{ if eq(environment, 'prod') }}:` block in `environments_loop.yml`).

### 10. Cross-env state sharing

```yaml
# Bad — every env would overwrite the same state
backendAzureRmKey: "terraform.tfstate"
```

```yaml
# Good
backendAzureRmKey: "${{ parameters.environment }}.tfstate"
```

---

## Things to avoid

- Editing pipeline yaml to add environment-specific values (use the library).
- Adding logic to `azure-pipelines.yml` — it stays a stage/template skeleton.
- Duplicating `TerraformInstaller` / `TerraformTaskV4` blocks outside `terraform_steps.yml`.
- Committing a real `.env`, tokens, subscription IDs, or connection strings.
- Managing resource groups (or anything else meant to pre-exist) in Terraform.
- Unpinned or widened provider version constraints.
- Skipping tags or omitting the `environment` tag.
- Renaming a job ID without updating every `dependsOn:` that references it.
- Adding a new environment without its tfvars **and** library **and** DevOps Environment.
- Sharing Terraform state files across environments.
- Bypassing Yarn (`npm install`, `pnpm`, ad-hoc `npx`) in a pipeline step.
- Removing the CDN purge step to save minutes.
- Adding a new `VITE_*` variable in only one of the three required places.
- Introducing a new CI/CD system (GitHub Actions, CircleCI) alongside Azure Pipelines — the repo has one.
- Adding a production Dockerfile — the app is deployed as static files, not as a container.

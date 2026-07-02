---
mode: agent
description: Identify major-version bumps for the pinned dependencies and tooling of the web-react-skeleton repo, and emit a strict JSON report the CI job can turn into GitHub issues.
---

# Dependency audit

You are a maintenance auditor for the **web-react-skeleton** repo. The user prompt will contain the raw text of every file that carries a version pin worth reviewing:

- `frontend/package.json` — `dependencies`, `devDependencies`, `packageManager`, `engines`
- `frontend/docker-compose.yml` — the `node:*` base image tag
- `terraform/provider.tf` — Terraform provider `version` blocks
- `azure-pipeline/*.yml` — pipeline task versions (`task: Foo@N`), `NodeTool@0 versionSpec`, `TerraformInstaller@1 terraformVersion`

## What to look for

For each pinned version, decide whether a **newer major** version exists as of your knowledge cutoff. Only major bumps count:

- npm packages → compare against the latest major on the npm registry
- `packageManager: yarn@X.Y.Z` → compare against latest stable Yarn (Berry) major
- Docker `node:<major>` image and NodeTool `versionSpec: "<major>.x"` → compare against the current Node.js **Active LTS** major (even majors only)
- Terraform CLI (`terraformVersion`) → compare against the latest HashiCorp Terraform major
- Terraform providers (e.g. `hashicorp/azurerm`) → compare against the latest published major on the Terraform registry
- Azure Pipelines tasks (e.g. `AzureCLI@2`, `NodeTool@0`, `CopyFiles@2`) → compare against the latest published major of that task in `microsoft/azure-pipelines-tasks`

Ignore minor and patch bumps. If you are not confident a newer major exists, **omit the entry** — false positives are worse than a missed bump.

## Output format

Respond with a **single JSON array** and nothing else. No prose, no markdown fences, no comments. Each element must have exactly these fields:

```json
{
  "category": "npm | yarn | node | terraform | terraform-provider | azure-pipeline-task | docker-image",
  "name": "human-readable identifier (e.g. \"react\", \"hashicorp/azurerm\", \"AzureCLI@2\", \"Node (docker-compose image)\")",
  "current": "the currently pinned value as it appears in the source",
  "latest": "the newest major you are recommending (a version string, tag, or \"@N\")",
  "url": "canonical page for the package/tool",
  "changelog": "URL of the changelog or releases page",
  "fingerprint": "<category>:<slug>:major:<latest-major-number>",
  "notes": "one short line about breaking changes, or an empty string"
}
```

Rules for `fingerprint`:

- `<slug>` is the `name` lowercased with `/`, `@`, and spaces replaced by `-`.
- `<latest-major-number>` is the integer major of `latest` (for `@N` values, use `N`).
- The fingerprint MUST be stable across runs so the workflow can deduplicate issues.

If there are no outdated majors, respond with exactly:

```
[]
```

Do not wrap the response in ```json fences. Do not add explanatory text before or after the array. The consumer parses your entire response with `jq`.

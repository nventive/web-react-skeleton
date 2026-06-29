---
description: Scaffold a new nventive web project. Interviews the user, picks an appropriate stack, and generates the initial codebase under `frontend/` plus root-level CI/CD, following the company conventions in `.github/instructions/frontend.instructions.md`.
mode: agent
---

# Scaffold a new web project

You are bootstrapping a brand-new web project in the **current empty (or near-empty) workspace**. Run the interview in [Interview](#interview), then materialise the project per [Layout](#layout) and [Scaffold steps](#scaffold-steps). All generated frontend code must comply with [`frontend.instructions.md`](../instructions/frontend.instructions.md) — do not restate its content, read it and apply it. Root-level CI/CD and IaC follow the principles in [CI/CD and IaC principles](#cicd-and-iac-principles) below.

## Goal

Produce a working, lint-clean, build-clean web project in this workspace, with:

- All web-app source code under `frontend/` at the repository root.
- Root-level CI/CD (and optional IaC) — never nested inside `frontend/`.
- `.github/copilot-instructions.md` and a code-review prompt installed in the new project so future Copilot work in that repo stays consistent.

Use the latest stable version of every framework and library at the time of running. Do not hardcode versions from memory — resolve them at scaffold time.

## Interview

Ask the user the following questions before generating anything. Group them, accept sensible defaults, and confirm the full set back to the user before proceeding.

**Project identity**
1. Project name / npm package name.
2. Short description (one sentence).

**Stack**
3. Meta-framework: Vite SPA · Next.js · Remix · Astro · TanStack Start · other.
4. UI library: MUI · shadcn/ui · Mantine · Chakra · none.
5. Styling: SCSS + BEM (default per `frontend.instructions.md` §8) · Tailwind · CSS Modules · CSS-in-JS.
6. State management: Zustand · Redux Toolkit · Jotai · React Context only · none.
7. Routing: depends on the meta-framework — confirm SPA routing lib (e.g. React Router) only if it is not built in.
8. Form library + schema validation: React Hook Form + Zod · React Hook Form + Yup · Formik · none.

**Features**
9. Internationalisation: yes/no. If yes, list languages (e.g. `en`, `fr`) and confirm whether translations are sourced from a Google Sheet (`sheet2i18n`) or kept as static JSON.
10. Authentication: none · OAuth provider (which one?) · SSO · custom.

**Testing**
11. Unit testing: **Vitest + Testing Library** · **Jest + Testing Library** · none. If a tool is chosen, it must be installed, configured, given a sample test, exposed via `yarn test` / `npm test`, and wired into the CI pipeline (a dedicated `test` job/step that fails the build on test failure). If "none" is chosen, do not install testing dependencies and do not add a test step to CI.

**Operations**
12. CI provider: GitHub Actions · Azure DevOps Pipelines · GitLab CI · none.
13. Target hosting: Azure Static Web Apps · Azure Storage + CDN · AWS S3 + CloudFront · Vercel · Cloudflare Pages · Netlify · other.
14. IaC: Terraform · Bicep · Pulumi · none (e.g. for Vercel/Netlify).
15. Environments: confirm the list, default `dev`, `qa`, `prod`. Confirm whether `prod` requires a manual approval gate.

## Decision rules

- Use the official latest scaffolding CLI for the chosen meta-framework (e.g. `npm create vite@latest`, `npx create-next-app@latest`). Run it into `frontend/`, then layer customisations on top — never hand-write what the CLI provides.
- Use the package manager the project will use day-to-day (default: Yarn via Corepack). Pin it via `packageManager` in `package.json`.
- TypeScript is mandatory. Path aliases follow `frontend.instructions.md` §3.
- Linting baseline: ESLint + Prettier always. Stylelint only when the styling answer involves CSS/SCSS files (skip it for Tailwind-only projects).
- The folder layout in `frontend/src/` follows `frontend.instructions.md` §12, scoped to what was requested (do not create empty `auth/`, `forms/`, `stores/` folders if those features were declined).
- CI step ordering: install → lint → typecheck → test (only if testing was chosen) → build → deploy (per-environment, gated as agreed in Q15).
- CI/CD and IaC follow the principles in [CI/CD and IaC principles](#cicd-and-iac-principles) below.

## CI/CD and IaC principles

The concrete pipeline format (GitHub Actions / Azure Pipelines / GitLab CI) and IaC tool are chosen at scaffold time. Independent of those choices, the generated CI/CD must respect:

- One file per concern: build, deploy, infra plan, infra apply.
- A single source of truth for the environment list. The pipeline iterates over it — it never duplicates jobs per environment.
- Plan on pull request, apply on merge to the release branch.
- Manual approval gate before `prod` if the user asked for one.
- Build artifacts are versioned and immutable across environments.

The generated IaC, when requested, must respect:

- One module per environment, parameterised by a short `tfvars` / equivalent file.
- Infrastructure state stored remotely (Terraform backend, Pulumi state service, etc.) — never local.
- Static frontends served from object storage behind a CDN, with:
  - HTTPS enforced (HTTP → HTTPS redirect).
  - SPA fallback rule when the app uses client-side routing (404 → `index.html`).
  - Security headers: `X-Frame-Options: DENY`, `Strict-Transport-Security`, `X-Content-Type-Options: nosniff`.

## Layout

The scaffold produces this root layout. Anything inside `frontend/` is web-app code; **CI/CD and IaC live at the root**, not inside `frontend/`.

```
.
├── frontend/                  # all web-app source code
│   ├── src/                   # per frontend.instructions.md §12
│   ├── public/
│   ├── package.json
│   ├── tsconfig*.json
│   ├── vite.config.ts (or next.config.ts, etc.)
│   └── README.md              # how to run/build/test the app
├── .github/
│   ├── copilot-instructions.md          # repo-wide
│   ├── instructions/
│   │   └── frontend.instructions.md     # applyTo: "frontend/**"
│   ├── prompts/
│   │   └── code-review-uncommitted.prompt.md
│   └── workflows/             # if CI provider = GitHub Actions
├── azure-pipelines.yml        # if CI provider = Azure DevOps (root file)
├── azure-pipeline/            # if CI provider = Azure DevOps (templates)
├── infra/                     # if IaC requested (terraform/, bicep/, etc.)
├── README.md
├── .gitignore
├── .editorconfig
└── LICENSE
```

## Scaffold steps

Perform in order. Do not skip validation between phases.

1. **Confirm the plan.** Echo the interview answers back as a short bullet list and wait for the user to confirm before writing files.
2. **Bootstrap `frontend/`.** Run the official CLI for the chosen meta-framework into a `frontend/` directory at the repo root. Accept TypeScript. Do not delete or rename files the CLI creates unless step 3 requires it.
3. **Apply `frontend.instructions.md` to `frontend/`.** Adjust `tsconfig` for strict mode and path aliases (§3), create the folder layout (§12), set up the styling solution (§8), wire i18n / auth / state / forms only if requested.
4. **Configure unit testing** (skip entirely if the user chose "none"). Install the chosen runner + `@testing-library/react` + `@testing-library/jest-dom` + `jsdom` (or `happy-dom` for Vitest). Add a `test` and a `test:ci` script to `frontend/package.json`. Create one passing sample test next to a sample component to prove the wiring works.
5. **Lint, format, typecheck baseline.** ESLint, Prettier, EditorConfig at the root level shared across the repo where it makes sense; Stylelint inside `frontend/` if applicable. Confirm `tsc --noEmit` passes.
6. **Generate root CI/CD** for the chosen provider, respecting [CI/CD and IaC principles](#cicd-and-iac-principles). The pipeline must:
   - Install dependencies inside `frontend/`.
   - Run `lint`, then `typecheck`, then `test:ci` (only if testing is enabled), then `build` — each as its own step so failures are obvious.
   - Loop over the environments from a single source of truth.
   - Gate `prod` behind manual approval if the user asked for it.
   - Deploy the built artifacts to the chosen hosting target.
7. **Generate IaC** at `infra/` if requested, parameterised per environment, with remote state configured. Respect [CI/CD and IaC principles](#cicd-and-iac-principles).
8. **Generate in-project Copilot artifacts** (see [Generated Copilot artifacts](#generated-copilot-artifacts) below). These live at the root of the new project, not inside `frontend/`.
9. **Write the README.** Document the chosen stack, how to run/build/test, how the CI works, and how to deploy. Reference `.github/instructions/frontend.instructions.md` as the source of frontend conventions.
10. **Validate** per the [Validation](#validation) section. Report any failure to the user before declaring the scaffold complete.

## Generated Copilot artifacts

The scaffold installs three Copilot files in the new project so future work in that repo stays consistent with the choices made here. They are split by scope so each file is the single source of truth for its area — never duplicate guidance across them.

### `.github/copilot-instructions.md` — repo-wide

Follow GitHub's [repository custom-instructions guidance](https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/add-custom-instructions/add-repository-instructions). This file applies to every Copilot request in the repo. Keep it concise (≤ 2 pages) and limit it to **repo-level concerns** — do not restate frontend conventions, those live in the path-specific file below.

Include:

- One-paragraph summary of the project: what it does, the chosen stack, key libraries.
- The real generated folder layout at the **repo root** (what was actually scaffolded).
- Exact commands runnable **from the repo root** for: install, dev, build, lint, typecheck, test (omit test if disabled), deploy. Use the path prefix (`cd frontend && …` or workspace syntax) so the commands are copy-pasteable.
- CI / deployment workflow summary: which provider, which files, which environments, which gates.
- A pointer to `.github/instructions/frontend.instructions.md` for frontend-specific rules.
- An instruction to trust this file and only search the codebase when it is incomplete or wrong.

### `.github/instructions/frontend.instructions.md` — path-specific, applies to `frontend/**`

Follow GitHub's [path-specific instructions guidance](https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/add-custom-instructions/add-repository-instructions#creating-path-specific-custom-instructions).

Use this skeleton's own [`.github/instructions/frontend.instructions.md`](../instructions/frontend.instructions.md) as the template — copy it into the generated project at the same path, then tailor it to the chosen stack:

- Keep the `applyTo: "frontend/**"` frontmatter.
- Replace the §12 folder layout with the layout actually generated for this project.
- Drop any **(stack-specific)** block that does not match the chosen stack; add new ones for the chosen stack where useful (e.g. Tailwind class-ordering rules, Next.js App Router gotchas).
- Drop the i18n section if i18n was not enabled.
- Drop the SCSS examples from §8 if a non-SCSS styling solution was chosen; replace them with idiomatic examples for that solution.
- Append a testing subsection if unit testing was enabled (file naming, where tests live, what must be tested).
- Append a short list of stack-specific gotchas surfaced during scaffolding.

The generated project must not depend on this skeleton repo at runtime — the copied file must be self-contained.

### `.github/prompts/code-review-uncommitted.prompt.md`

A reusable prompt that reviews the user's **uncommitted** changes (working tree + staged, i.e. `git diff HEAD`). It should:

- Run `git status --short` and `git diff HEAD` to inventory what changed.
- Review the diff against the repo-wide `.github/copilot-instructions.md`, and for any files matching `frontend/**` also against `.github/instructions/frontend.instructions.md`.
- Look for the obvious classes of problems: TypeScript escapes (`any`, `as unknown as`), inline styles, `!important` without justification, `dangerouslySetInnerHTML`, missing translations, hard-coded colours/spacing, untested new logic, missing error handling at system boundaries, accessibility regressions, secrets/PII in code or commit messages.
- Group findings by severity (Blocker / Major / Minor / Nit) and end with a short summary of what looks good.
- Not modify any files — review only.

Frontmatter for this prompt:
```yaml
---
description: Review uncommitted changes (working tree + staged) against the project's standards and Copilot instructions.
mode: agent
---
```

## Conventions to apply

All generated frontend code must conform to [`frontend.instructions.md`](../instructions/frontend.instructions.md). When a section there is marked **(stack-specific)** and the chosen stack does not match, adapt the principle to the chosen stack rather than copying the literal example. Root-level CI/CD and IaC follow [CI/CD and IaC principles](#cicd-and-iac-principles).

## Validation

Before reporting success, run inside the workspace:

1. `cd frontend && <pkg-manager> install`
2. `<pkg-manager> run lint`
3. `<pkg-manager> run typecheck` (or `tsc --noEmit`)
4. `<pkg-manager> run test:ci` — **only if** unit testing was enabled. Confirm the sample test passes.
5. `<pkg-manager> run build` — confirm it produces the expected output directory.
6. `<pkg-manager> run dev` — start the dev server, wait for the ready signal, then stop it. Confirm no errors in the output.
7. Lint the CI file(s) with the provider's recommended linter when available (`actionlint` for GitHub Actions, `az pipelines validate` for Azure, etc.).

Report each step's pass/fail to the user. Do not silently swallow failures.

## Out of scope

The scaffold must **not** produce:

- Business pages, real domain models, or real API contracts.
- Real credentials, tokens, or environment-specific secrets. Use placeholders and document the variable names.
- A design system beyond a neutral default palette/typography sufficient to render the sample.
- End-to-end / visual / load testing setups (only unit testing is in scope when requested).
- A backend service. This scaffold is frontend-only.

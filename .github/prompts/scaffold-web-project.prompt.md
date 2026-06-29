---
description: Scaffold a new nventive web project. Interviews the user, picks an appropriate stack, and generates the initial codebase under `frontend/` plus root-level CI/CD, applying the frontend conventions embedded in this prompt.
mode: agent
---

# Scaffold a new web project

You are bootstrapping a brand-new web project in the **current empty (or near-empty) workspace**. Run the interview in [Interview](#interview), then materialise the project per [Layout](#layout) and [Scaffold steps](#scaffold-steps). All generated frontend code must comply with [frontend-conventions.md](frontend-conventions.md). Root-level CI/CD and IaC follow the principles in [CI/CD and IaC principles](#cicd-and-iac-principles).

## Goal

Produce a working, lint-clean, build-clean web project with all web-app source under `frontend/`, root-level CI/CD (and optional IaC), and the Copilot artifacts from [Generated Copilot artifacts](#generated-copilot-artifacts). Use the latest stable version of every framework and library at scaffold time — do not hardcode versions from memory.

## Interview

Ask the user the following questions before generating anything. Group them, accept sensible defaults, and confirm the full set back to the user before proceeding.

**Project identity**
1. Project name / npm package name.
2. Short description (one sentence).

**Tooling**
3. Package manager: npm · Yarn (Classic or Berry — ask which) · pnpm. Default: npm. Use this for every install/script command emitted by the scaffold and referenced in the CI pipeline and READMEs.

**Stack**
4. Meta-framework: Vite SPA · Next.js · Remix · Astro · TanStack Start · other.
5. UI library: MUI · shadcn/ui · Mantine · Chakra · none.
6. Styling: SCSS + BEM (default per [frontend-conventions.md §8](frontend-conventions.md#8-styling)) · Tailwind · CSS Modules · CSS-in-JS.
7. State management: Zustand · Redux Toolkit · Jotai · React Context only · none.
8. Routing: depends on the meta-framework — confirm SPA routing lib (e.g. React Router) only if it is not built in.
9. Form library + schema validation: React Hook Form + Zod · React Hook Form + Yup · Formik · none.

**Features**
10. Internationalisation: yes/no. If yes, list languages (e.g. `en`, `fr`) and confirm whether translations are sourced from a Google Sheet (`sheet2i18n`) or kept as static JSON.
11. Authentication: none · OAuth provider (which one?) · SSO · custom.

**Testing**
12. Unit testing: **Vitest + Testing Library** · **Jest + Testing Library** · none. If a tool is chosen, it must be installed, configured, given a sample test, exposed via `yarn test` / `npm test`, and wired into the CI pipeline (a dedicated `test` job/step that fails the build on test failure). If "none" is chosen, do not install testing dependencies and do not add a test step to CI.

**Operations**
13. CI provider: GitHub Actions · Azure DevOps Pipelines · GitLab CI · none.
14. Target hosting: Azure Static Web Apps · Azure Storage + CDN · AWS S3 + CloudFront · Vercel · Cloudflare Pages · Netlify · other.
15. IaC: Terraform · Bicep · Pulumi · none (e.g. for Vercel/Netlify).
16. Environments: confirm the list, default `dev`, `qa`, `prod`. Confirm whether `prod` requires a manual approval gate.

## Decision rules

- Use the official latest scaffolding CLI for the chosen meta-framework (e.g. `npm create vite@latest`, `npx create-next-app@latest`). Run it into `frontend/`, then layer customisations on top — never hand-write what the CLI provides.
- Use the package manager from Q3 consistently across scripts, lockfile, CI, and READMEs. Commit the lockfile.
- TypeScript is mandatory. ESLint + Prettier always; Stylelint only when CSS/SCSS files are involved.
- Scope the `frontend/src/` layout from [frontend-conventions.md §12](frontend-conventions.md#12-recommended-folder-layout) to what was requested — do not create empty folders for declined features.
- CI step ordering: install → lint → typecheck → test (if enabled) → build → deploy (per-environment, gated per Q16).

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
│   ├── src/                   # per frontend-conventions.md §12
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
3. **Apply [frontend-conventions.md](frontend-conventions.md) to `frontend/`.** Adjust `tsconfig` for strict mode and path aliases ([§3](frontend-conventions.md#3-typescript)), create the folder layout ([§12](frontend-conventions.md#12-recommended-folder-layout)), set up the styling solution ([§8](frontend-conventions.md#8-styling)), wire i18n / auth / state / forms only if requested.
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
9. **Write the README.** Document the chosen stack, how to run/build/test, how the CI works, and how to deploy. Reference the generated `.github/instructions/frontend.instructions.md` as the source of frontend conventions.
10. **Validate** per the [Validation](#validation) section. Report any failure to the user before declaring the scaffold complete.

## Generated Copilot artifacts

Three files, each the single source of truth for its scope — do not duplicate guidance across them.

### `.github/copilot-instructions.md` — repo-wide

Follow GitHub's [repository custom-instructions guidance](https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/add-custom-instructions/add-repository-instructions). Concise (≤ 2 pages), repo-level only — do not restate frontend conventions. Include:

- One-paragraph summary of the project: what it does, chosen stack, key libraries.
- The real generated repo-root folder layout.
- Copy-pasteable commands from the repo root for install, dev, build, lint, typecheck, test (if enabled), deploy.
- CI / deployment summary: provider, files, environments, gates.
- Pointer to the generated `.github/instructions/frontend.instructions.md`.
- Instruction to trust this file and only search the codebase when it is incomplete or wrong.

### `.github/instructions/frontend.instructions.md` — path-specific, applies to `frontend/**`

Copy [frontend-conventions.md](frontend-conventions.md) (sections 1–13) verbatim into the generated file, prepend `---\napplyTo: "frontend/**"\n---` frontmatter, then:

- Replace the §12 layout with the one actually generated.
- Drop any **(stack-specific)** block that does not match the chosen stack; add equivalents for the chosen stack where useful.
- Drop §7 (i18n) if i18n is disabled.
- Replace §8's SCSS examples with idiomatic examples for the chosen styling solution.
- Append a testing subsection if unit testing is enabled.

The file must be self-contained — no runtime dependency on this skeleton.

### `.github/prompts/code-review-uncommitted.prompt.md`

A reusable prompt that reviews the user's **uncommitted** changes (working tree + staged, i.e. `git diff HEAD`). It should:

- Run `git status --short` and `git diff HEAD` to inventory what changed.
- Review the diff against the repo-wide `.github/copilot-instructions.md`, and for any files matching `frontend/**` also against the generated `.github/instructions/frontend.instructions.md`.
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

## Frontend conventions

The nventive frontend conventions live in [frontend-conventions.md](frontend-conventions.md) (sections 1–13). The scaffolder must read that file, apply its rules to every file generated under `frontend/`, and use it as the canonical source when emitting the generated project's `frontend.instructions.md` (see [Generated Copilot artifacts → frontend.instructions.md](#githubinstructionsfrontendinstructionsmd--path-specific-applies-to-frontend)).

## Validation

From `frontend/`, run in order and report each result: `install`, `lint`, `typecheck`, `test:ci` (if enabled), `build`, then `dev` (start, wait for ready signal, stop). Lint the CI file(s) with the provider's recommended linter when available (`actionlint`, `az pipelines validate`, …). Do not silently swallow failures.

## Out of scope

The scaffold must **not** produce:

- Business pages, real domain models, or real API contracts.
- Real credentials, tokens, or environment-specific secrets. Use placeholders and document the variable names.
- A design system beyond a neutral default palette/typography sufficient to render the sample.
- End-to-end / visual / load testing setups (only unit testing is in scope when requested).
- A backend service. This scaffold is frontend-only.

---
description: Scaffold a new nventive web project. Interviews the user, picks an appropriate stack, and generates the initial codebase under `frontend/` plus root-level CI/CD, applying the frontend conventions embedded in this prompt.
mode: agent
---

# Scaffold a new web project

You are bootstrapping a brand-new web project in the **current empty (or near-empty) workspace**. Run the interview in [Interview](#interview), then materialise the project per [Layout](#layout) and [Scaffold steps](#scaffold-steps). All generated frontend code must comply with [frontend-conventions.md](frontend-conventions.md). Root-level CI/CD and IaC follow the principles in [CI/CD and IaC principles](#cicd-and-iac-principles).

## Goal

Produce a working, lint-clean, build-clean web project with all web-app source under `frontend/`, root-level CI/CD (and optional IaC), and the Copilot artifacts from [Generated Copilot artifacts](#generated-copilot-artifacts). Use the latest stable version of every framework and library at scaffold time — do not hardcode versions from memory.

## Guiding principles

These rules sit above everything else in this prompt. If any later instruction looks like it would violate them, stop and apply these instead.

- **Lean by default.** Prefer installing nothing over installing something "just in case". If the user did not explicitly ask for a library, tool, integration, script, config file, or folder — and it is not strictly required to make a chosen feature work — do not add it. It is always cheaper to add a dependency later than to remove one that became load-bearing.
- **No speculative scaffolding.** Do not create empty folders, placeholder modules, sample business components, demo pages, example API clients, or "you might want this" config files. Only generate what is needed to satisfy the user's answers and to make the validation step pass.
- **No bundled extras.** Choosing a meta-framework / state lib / form lib does not auto-pull adjacent libraries (HTTP clients, date libs, icon packs, animation libs, analytics, error trackers, storybook, husky, lint-staged, commitlint, …). Each of those is a separate decision the user must make.
- **Ask when in doubt.** If a question's answer is ambiguous, if two answers conflict, if an "obvious" addition would technically help but was never requested, or if the minimal interpretation feels too thin — stop and ask the user with a concrete yes/no or A/B question. Do not silently pick the bigger option.
- **Smallest viable wiring.** When a feature is requested, install only what that feature needs to work end-to-end (lib + minimal config + one wiring point). No extra plugins, presets, or ecosystem add-ons unless asked.
- **Reversibility bias.** When two valid approaches exist and the user has not chosen, prefer the one that is easier to change or remove later.

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

**Wrap-up**

17. **Anything missing?** Ask the user, in one open-ended question, whether there is anything they want added to the project that was not covered by questions 1–16 (extra tooling, libraries, files, scripts, conventions, integrations, …). Capture any answer and fold it into the plan; if the answer is "no" / empty, move on without further prompting.
18. **Sanity check the whole plan.** Re-read the full set of answers (1–17) as a coherent system and look for combinations that don't make sense, contradict each other, or have a clearly better alternative (e.g. a hosting target incompatible with the chosen IaC, a state library redundant with the meta-framework's built-ins, a testing choice that won't work with the chosen runner). If you spot something, surface it to the user with a concrete proposed change and wait for their decision. If everything is internally consistent, say nothing and proceed — do not invent concerns to report.

## Decision rules

- Use the official latest scaffolding CLI for the chosen meta-framework (e.g. `npm create vite@latest`, `npx create-next-app@latest`). Run it into `frontend/`, then layer customisations on top — never hand-write what the CLI provides.
- Use the package manager from Q3 consistently across scripts, lockfile, CI, and READMEs. Commit the lockfile.
- TypeScript is mandatory. ESLint + Prettier always; Stylelint only when CSS/SCSS files are involved.
- Scope the `frontend/src/` layout from [frontend-conventions.md §12](frontend-conventions.md#12-recommended-folder-layout) to what was requested — do not create empty folders for declined features.
- CI step ordering: install → lint → typecheck → test (if enabled) → build → deploy (per-environment, gated per Q16).
- Apply the [Guiding principles](#guiding-principles) on every install/file/config decision. When unsure whether something is needed, leave it out and ask the user instead of adding it.

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
│   ├── instructions/                    # split per concern, each scoped via `applyTo`
│   │   ├── frontend.instructions.md             # baseline — applyTo: "frontend/**"
│   │   ├── frontend-react.instructions.md       # components/hooks/state — applyTo: "frontend/**/*.{ts,tsx}"
│   │   ├── frontend-styling.instructions.md     # design tokens, styling, responsiveness
│   │   ├── frontend-i18n.instructions.md        # only if i18n enabled
│   │   └── frontend-testing.instructions.md     # only if unit testing enabled
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
9. **Write the README.** Document the chosen stack, how to run/build/test, how the CI works, and how to deploy. Reference the generated `.github/instructions/` directory as the source of frontend conventions (list each file actually emitted).
10. **Validate** per the [Validation](#validation) section. Report any failure to the user before declaring the scaffold complete.

## Generated Copilot artifacts

Each file below is the single source of truth for its scope — do not duplicate guidance across them. Cross-reference instead.

### `.github/copilot-instructions.md` — repo-wide

Follow GitHub's [repository custom-instructions guidance](https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/add-custom-instructions/add-repository-instructions). Concise (≤ 2 pages), repo-level only — do not restate frontend conventions. Include:

- One-paragraph summary of the project: what it does, chosen stack, key libraries.
- The real generated repo-root folder layout.
- Copy-pasteable commands from the repo root for install, dev, build, lint, typecheck, test (if enabled), deploy.
- CI / deployment summary: provider, files, environments, gates.
- A short index of the `.github/instructions/*.instructions.md` files that were generated, with one line each describing what scope they cover.
- Instruction to trust these files and only search the codebase when they are incomplete or wrong.

### `.github/instructions/` — frontend instructions, split per concern

Do **not** dump all of [frontend-conventions.md](frontend-conventions.md) into one file. Split it into the files below, each with focused `applyTo` frontmatter so Copilot only loads what is relevant to the file being edited. Generate only the files that match the user's choices.

For every file: prepend YAML frontmatter (`---\napplyTo: "<glob>"\n---`), open with a one-line purpose sentence, end with a short "See also" list linking to sibling instructions files. Keep each file self-contained — no runtime dependency on this skeleton — and do not restate guidance that belongs in a sibling file.

**Authoring rules applied to every file**

- Source the canonical guidance from [frontend-conventions.md](frontend-conventions.md), but **enhance** it: replace SCSS-only examples with idiomatic snippets for the chosen styling solution, replace generic stack references with the chosen meta-framework / state library / form library, drop any **(stack-specific)** block that does not match the chosen stack, and add equivalents for the chosen stack where useful.
- Show concrete `do this` / `not this` snippets, not just prose.
- Use the real path aliases configured in `tsconfig` (not the placeholders from the skeleton).
- Keep each file focused: if a section grew significantly, prefer moving it to its own sibling file rather than bloating one.

**Files to generate**

1. **`frontend.instructions.md`** — baseline, always generated.
   - Frontmatter: `applyTo: "frontend/**"`.
   - Contents: §1 Code formatting, §3 TypeScript, §4 Functions, §11 File contents order, §12 Recommended folder layout (replaced with the layout actually generated), §13 Anti-patterns. Add a short "Frontend security do's and don'ts" subsection covering `dangerouslySetInnerHTML`, env var handling (`VITE_PUBLIC_*` / `NEXT_PUBLIC_*` only for non-secrets), and where secrets must live instead.
   - Ends with an index of the sibling instruction files and what they cover.

2. **`frontend-react.instructions.md`** — always generated.
   - Frontmatter: `applyTo: "frontend/**/*.{ts,tsx}"`.
   - Contents: §5 React components, §6 State (rewritten around the chosen state library or "React Context only" if none), §9 Skeletons / loading states. Add a short accessibility subsection (semantic HTML, labelled controls, focus management, `aria-*` only when semantics aren't enough).
   - If a form library was chosen, add a focused "Forms" subsection with one canonical example using that library + its validator.

3. **`frontend-styling.instructions.md`** — always generated.
   - Frontmatter: `applyTo` scoped to the styling solution actually used — e.g. `"frontend/**/*.{scss,css,tsx,ts}"` for SCSS/CSS-Modules, `"frontend/**/*.{ts,tsx,css}"` for Tailwind, `"frontend/**/*.{ts,tsx}"` for CSS-in-JS.
   - Contents: §2 Designs, §8 Styling (rewritten end-to-end for the chosen solution — naming conventions, token usage, theming, dark-mode strategy if any), §10 Responsiveness (breakpoints, mobile-first, container queries when applicable).

4. **`frontend-i18n.instructions.md`** — only if i18n is enabled.
   - Frontmatter: `applyTo: "frontend/**/*.{ts,tsx,json}"`.
   - Contents: §7 Internationalization, rewritten for the chosen source-of-truth (static JSON vs `sheet2i18n`). List the configured locales, the lookup helper, pluralisation rules, and the workflow for adding a new key.

5. **`frontend-testing.instructions.md`** — only if unit testing is enabled.
   - Frontmatter: `applyTo: "frontend/**/*.{test,spec}.{ts,tsx}"`.
   - Contents: chosen runner + Testing Library conventions, file naming and colocation, what to test vs. not test, querying priority (`getByRole` first), user-event over `fireEvent`, mocking conventions for network/storage/i18n, the `test` vs `test:ci` scripts, and how to run a single test.

### `.github/prompts/code-review-uncommitted.prompt.md`

A reusable prompt that reviews the user's **uncommitted** changes (working tree + staged, i.e. `git diff HEAD`). It should:

- Run `git status --short` and `git diff HEAD` to inventory what changed.
- Review the diff against the repo-wide `.github/copilot-instructions.md`, and for any file under `frontend/**` also against every matching `.github/instructions/frontend*.instructions.md` (match each file's `applyTo` glob against the changed path).
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

The nventive frontend conventions live in [frontend-conventions.md](frontend-conventions.md) (sections 1–13). The scaffolder must read that file, apply its rules to every file generated under `frontend/`, and use it as the canonical source when emitting the generated project's split instruction files (see [Generated Copilot artifacts → `.github/instructions/`](#githubinstructions--frontend-instructions-split-per-concern)).

## Validation

From `frontend/`, run in order and report each result: `install`, `lint`, `typecheck`, `test:ci` (if enabled), `build`, then `dev` (start, wait for ready signal, stop). Lint the CI file(s) with the provider's recommended linter when available (`actionlint`, `az pipelines validate`, …). Do not silently swallow failures.

## Out of scope

The scaffold must **not** produce:

- Business pages, real domain models, or real API contracts.
- Real credentials, tokens, or environment-specific secrets. Use placeholders and document the variable names.
- A design system beyond a neutral default palette/typography sufficient to render the sample.
- End-to-end / visual / load testing setups (only unit testing is in scope when requested).
- A backend service. This scaffold is frontend-only.

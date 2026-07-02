# web-react-skeleton — Copilot instructions

Vite + React 18 + TypeScript SPA, styled with MUI v6 (`@mui/material` + `@mui/material-pigment-css`), routed by React Router v6, state via Zustand, forms via Yup, i18n via i18next (locales generated from a Google Sheet). Deployed as static files to Azure Storage `$web` + Azure CDN. Package manager: **Yarn 4** (`packageManager: yarn@4.5.0`). Node: **22.x** in CI, `20.11.1` in the local Docker dev container.

This file is an orientation + index. **It does not restate any rule** — every convention lives in a scoped `.instructions.md` file (see the table below). If a rule seems missing here, load the matching scoped file.

## Repo layout

```
frontend/            React app (Vite, all source, all rules)
terraform/           HCL infra (per-env tfvars in env/)
azure-pipeline/      Azure Pipelines templates (root: azure-pipelines.yml)
doc/                 Human docs (Azure setup notes)
.github/instructions/  <-- scoped instruction files (this table)
```

Working directory for every yarn command is `frontend/`.

## Commands

| Command | Purpose |
|---|---|
| `yarn dev` | Vite dev server (default port from `.env` `VITE_PORT`). |
| `yarn build` | Type-check (`tsc -b`) then production build. |
| `yarn preview` | Serve the built `dist/` for smoke-testing. |
| `yarn lint` | Runs all linters + Prettier write. Use before any commit. |
| `yarn lint:scripts` | ESLint on `.ts` / `.tsx`. |
| `yarn lint:styles` | Stylelint on `.scss`. |
| `yarn lint:editor` | eclint on `src/app`. |
| `yarn sheet2i18n` | Regenerate `assets/locales/{en,fr}.json` from the Google Sheet. Never hand-edit those JSONs. |

## Instruction files

Load the ones matching the task. Multi-scope tasks (e.g. "add a new authenticated page with a form that calls an API") legitimately need several at once.

| File | `applyTo` scope | Load when… |
|---|---|---|
| [typescript.instructions.md](instructions/typescript.instructions.md) | `frontend/src/**/*.{ts,tsx}` | Any TS work — naming (`I`/`E` prefix), interfaces, path aliases, strictness. |
| [react.instructions.md](instructions/react.instructions.md) | `frontend/src/**/*.tsx` | Writing a component, hooks, JSX composition. |
| [components-vs-containers.instructions.md](instructions/components-vs-containers.instructions.md) | `frontend/src/app/{components,containers}/**/*.{ts,tsx}` | Deciding which folder a new piece of UI belongs in. |
| [mui-and-uikit.instructions.md](instructions/mui-and-uikit.instructions.md) | `frontend/src/app/components/**`, `pages/uikit/**`, `themes/**`, `vite.config.ts` | Wrapping an MUI primitive; registering a component in the UiKit page. |
| [styling.instructions.md](instructions/styling.instructions.md) | `frontend/src/**/*.{scss,tsx}`, `themes/**/*.ts` | Any styling decision — utility classes, `styled()`, `sx`, CSS Modules, SCSS. |
| [icons.instructions.md](instructions/icons.instructions.md) | `frontend/src/app/icons/**/*.{ts,tsx}` | Adding or editing an inline-SVG icon. |
| [routing-and-auth.instructions.md](instructions/routing-and-auth.instructions.md) | `frontend/src/app/{routes,pages,hocs}/**/*.{ts,tsx}` | Adding a page, a route, or touching auth / `EPermission`. |
| [forms.instructions.md](instructions/forms.instructions.md) | `frontend/src/app/forms/**/*.{ts,tsx}` | Building a form (Yup schema + controlled state + `FieldHelperText`). |
| [services-api.instructions.md](instructions/services-api.instructions.md) | `frontend/src/app/services/**/*.{ts,tsx}` | Adding an Axios call or a new service domain. |
| [state-stores.instructions.md](instructions/state-stores.instructions.md) | `frontend/src/app/stores/**/*.ts` | Adding or consuming a Zustand store. |
| [i18n.instructions.md](instructions/i18n.instructions.md) | `frontend/src/**/*.tsx`, `assets/locales/**/*.json`, `shared/i18n.ts`, `sheet2i18n.config.cjs` | Anything user-facing text or the `sheet2i18n` workflow. |
| [infra.instructions.md](instructions/infra.instructions.md) | `azure-pipelines.yml`, `azure-pipeline/**`, `terraform/**`, `frontend/{docker-compose.yml,entrypoint.sh,example.env}` | CI/CD, Terraform, per-env variables, local Docker dev. |

## Repo-wide invariants

Rules that span every scope. Violating any of these breaks the project's shape.

- **Yarn 4 only.** Never `npm install`, `pnpm`, `bun`, or ad-hoc `npx`. `yarn.lock` is the lock file.
- **One CI/CD system: Azure Pipelines.** Do not add GitHub Actions, CircleCI, or any parallel pipeline.
- **One router: React Router v6.** No TanStack Router, Next.js router, or hand-rolled routing.
- **One state manager: Zustand (v4).** No Redux, MobX, Jotai, Recoil, or Context-as-store.
- **One form/validation stack: Yup + controlled `useState`.** No `react-hook-form`, `formik`, `final-form`.
- **One i18n stack: i18next + `sheet2i18n`.** Locale JSONs are generated — never hand-edited.
- **One styling stack: MUI v6 + Pigment-CSS.** No Tailwind, no Emotion runtime, no styled-components.
- **No icon library.** Every icon is a hand-wrapped SVG under `@icons/*` — never import from `@mui/icons-material` (it's in `package.json` for historical reasons but has zero imports).
- **No production Dockerfile.** The app deploys as static files; Docker is dev-only.
- **Path aliases everywhere** (`@components`, `@containers`, `@forms`, `@hocs`, `@icons`, `@pages`, `@routes`, `@services`, `@shared`, `@stores`, `@styles`, `@assets`, `@enums`). Never use relative imports across folders.
- **Never hand-edit generated files:** `assets/locales/*.json` (regenerated by `sheet2i18n`), `dist/*` (build output), `yarn.lock` (managed by Yarn).
- **Strict TypeScript.** Do not weaken `strict`, `noUnusedLocals`, `noUnusedParameters`, or `noFallthroughCasesInSwitch`. No `// @ts-ignore` without a linked follow-up.

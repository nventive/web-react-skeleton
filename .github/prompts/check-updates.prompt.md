---
mode: agent
description: Audit dependencies (frontend packages, Node/Yarn, Terraform providers) and report what should be updated, grouped by severity, respecting the repo's stack invariants.
---

# Dependency update audit

You are running a **read-only dependency audit** for the web-react-skeleton repo. Do not edit files, do not modify `package.json` / `yarn.lock` / `*.tf`, do not run installs or upgrades. Only inspect and report.

## 1. Determine the scope

If the user provided a scope in their message (`frontend`, `node`, `ci`, `terraform`, `security`, or a specific package name), audit only that. Otherwise audit **everything**: frontend packages, Node/Yarn toolchain, CI runners, and Terraform providers.

## 2. Load the ground truth

Read the files that define the current pinned versions:

- [frontend/package.json](frontend/package.json) — declared ranges + `packageManager`.
- [frontend/yarn.lock](frontend/yarn.lock) — resolved versions (do not read fully; grep for specific packages as needed).
- [azure-pipeline/build_frontend.yml](azure-pipeline/build_frontend.yml) — CI Node version (`NodeTool@0` `versionSpec`).
- [frontend/docker-compose.yml](frontend/docker-compose.yml) — local dev Node image tag.
- [terraform/provider.tf](terraform/provider.tf) — Terraform provider pins.
- [.github/copilot-instructions.md](.github/copilot-instructions.md) — **repo-wide invariants (see §4)**.

Also load `frontend/.nvmrc` if it exists.

## 3. Collect current-vs-latest data

Run these commands from `frontend/` (never from the repo root):

```
yarn outdated
yarn npm audit --recursive --severity moderate
```

If `yarn outdated` is not available in the installed Yarn 4 plugin set, fall back to:

```
yarn info <pkg> --json
```

for each dependency you want to check. Do **not** run `yarn upgrade`, `yarn up`, `npm install`, `npx npm-check-updates`, or anything that mutates `package.json` / `yarn.lock`.

For non-frontend items:

- **Node.js:** compare CI (`22.x` in [azure-pipeline/build_frontend.yml](azure-pipeline/build_frontend.yml)) vs Docker (`node:20.11.1` in [frontend/docker-compose.yml](frontend/docker-compose.yml)) vs the current active LTS line.
- **Yarn:** compare `packageManager` in [frontend/package.json](frontend/package.json) vs the latest stable Yarn 4 release.
- **Terraform providers:** compare pins in [terraform/provider.tf](terraform/provider.tf) vs the latest release on the HashiCorp registry.

If you cannot reach the network for the latest version of a package, say so once at the top of the report — do not guess.

## 4. Respect the repo-wide invariants

These are locked in [.github/copilot-instructions.md](.github/copilot-instructions.md). **Never** propose swapping them out, even if a "better" alternative exists:

- Package manager: **Yarn 4 only** (no npm / pnpm / bun migration).
- CI: **Azure Pipelines only** (no GitHub Actions / CircleCI).
- Router: **React Router v6** (no TanStack Router / Next router).
- State: **Zustand v4** (no Redux / MobX / Jotai / Recoil).
- Forms/validation: **Yup + controlled `useState`** (no react-hook-form / formik / final-form).
- i18n: **i18next + sheet2i18n**.
- Styling: **MUI v6 + `@mui/material-pigment-css`** (no Tailwind / Emotion runtime / styled-components).
- Icons: **hand-wrapped SVGs under `@icons/*`** (never suggest a real icon library, even though `@mui/icons-material` is in `package.json`).

For each locked dependency (`react-router-dom`, `zustand`, `yup`, `@mui/material`, `@mui/material-pigment-css`, `i18next`, `react-i18next`, `sheet2i18n`), report **only patch/minor updates** and any **major that stays within the same locked major line** (e.g. Zustand `4.5.x → 4.5.y`). If a new major has been released (e.g. Zustand 5, React Router 7, MUI 7), mention it as an **informational** note under a separate `Locked-major upgrades (informational)` section — never as a blocker or warning.

## 5. Classify each finding

Use exactly these three severities:

| Severity     | Meaning                                                                                                                                                                                                        |
| ------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `blocker`    | A **stable** major-version bump available on a non-locked dep (see stability + LTS rules below), known CVE at `high`/`critical`, EOL runtime (Node LTS dropped), or version drift that will break the next CI run. |
| `warning`    | Moderate CVE, or Node/Yarn drift between CI and Docker.                                                                                                                                                        |
| `suggestion` | Safe patch/minor bumps, or a fresh patch on a locked dep.                                                                                                                                                      |

### Stability gate for major bumps

A major bump is only a `blocker` if the newer major is **stable**. Skip (or demote to informational) any release whose version or `dist-tags` marks it as pre-release:

- Any semver pre-release suffix: `-alpha`, `-beta`, `-rc`, `-canary`, `-next`, `-pre`, `-experimental`, `-nightly`, `-dev`, `-insiders`.
- Any `dist-tag` other than `latest` (e.g. `next`, `beta`, `rc`, `canary`, `experimental`). Resolve "stable latest" from the `latest` dist-tag on the npm registry — if the highest `latest`-tagged version is still on the current major, there is **no** stable major bump to report.

### LTS gate for majors on runtimes / frameworks that publish LTS lines

For dependencies that publish an **LTS cadence** — currently **Node.js** (explicit LTS schedule) and any package that publishes an `lts` / `lts-<name>` `dist-tag` or maintains `version-N` / `latest-vN` tags for supported majors — only flag a major bump when the target major is itself on an LTS / supported line.

Rules:

- If the current major is on an LTS line **and** the newer stable major is **not yet LTS**, do **not** report it as `blocker` or `warning`. Add a one-line note under `Locked-major upgrades (informational)`: `<pkg> vN is stable but not yet LTS — wait for the next LTS.`
- If the current major has been **dropped from LTS / entered EOL**, that is always a `blocker` (existing EOL rule).
- If the newer major is LTS (or the dep does not have an LTS concept), apply the normal stable-major-bump `blocker` rule.
- For **Node.js** specifically: `blocker` means the runtime pinned in [azure-pipeline/build_frontend.yml](azure-pipeline/build_frontend.yml) or [frontend/docker-compose.yml](frontend/docker-compose.yml) is EOL or falls behind the current **Active LTS** line. A newer Current (non-LTS) release is never a blocker.

### Locked deps

Locked deps (see §4) are **exempt** from the major-bump-as-blocker rule: a new major on a locked dep goes to `Locked-major upgrades (informational)`, never `blocker` or `warning`.

For **every non-patch bump**, include a one-line **impact hint**: which folders are likely to need code changes. Examples:

- `axios` major → [frontend/src/app/services/**](frontend/src/app/services)
- `react` / `react-dom` major → [frontend/src/**/*.tsx](frontend/src)
- `@mui/material` or `@mui/material-pigment-css` → [frontend/src/app/components/**](frontend/src/app/components), [frontend/src/themes/**](frontend/src/themes), [frontend/vite.config.ts](frontend/vite.config.ts)
- `zustand` → [frontend/src/app/stores/**](frontend/src/app/stores)
- `yup` → [frontend/src/app/forms/**](frontend/src/app/forms)
- `react-router-dom` → [frontend/src/app/routes/**](frontend/src/app/routes), [frontend/src/app/pages/**/*.route.tsx](frontend/src/app/pages)
- `i18next` / `react-i18next` → [frontend/src/app/shared/i18n.ts](frontend/src/app/shared/i18n.ts), [frontend/src/assets/locales/](frontend/src/assets/locales)
- `vite` / `@vitejs/plugin-react` / `@pigment-css/vite-plugin` → [frontend/vite.config.ts](frontend/vite.config.ts)
- `typescript` → repo-wide, run `yarn build` after bump.
- `eslint*` / `stylelint*` / `prettier` → [frontend/package.json](frontend/package.json) scripts, config files.

If a bump has a known migration guide, link it (official docs only — no third-party blogs).

## 6. Report — grouped, terse, actionable

If nothing needs updating, reply with a single line: `✅ All dependencies are up to date.` and stop.

Otherwise, output only the sections that have findings, in this order:

1. **Summary** — one line: `Audited <scope> — <N> blocker(s), <N> warning(s), <N> suggestion(s).`
2. **Blockers**
3. **Warnings**
4. **Suggestions** — group safe patch/minor bumps into a single fenced code block that can be pasted into a `yarn up` command, e.g.:

   ```
   yarn up axios@^1.7.9 dayjs@^1.11.13 classnames@^2.5.2
   ```

5. **Locked-major upgrades (informational)** — only if a new major exists on a locked dependency; state clearly that these are **not** to be applied.
6. **Toolchain drift** — Node CI vs Docker vs `.nvmrc`, Yarn `packageManager` vs latest 4.x, Terraform providers.

### Finding format

For each **blocker** or **warning**, use this shape (level-4 heading so it renders as a card):

> #### 🔴 Blocker — `<package>` `<current>` → `<latest>`
>
> One sentence: why it matters (CVE id, EOL date, breaking-change summary).
>
> _Impact:_ [frontend/src/app/services/**](frontend/src/app/services) · _Migration:_ [changelog link]
>
> _Command:_ `yarn up <package>@^<version>` _(review required)_

Icons: `🔴 Blocker`, `🟠 Warning`, `🟡 Suggestion`.

Cap the report at **15 findings**. If more exist, keep the highest-severity ones and end with `_… N more low-severity patches omitted._`

## 7. Stop

After the report, stop. Do not open PRs, do not edit files, do not run `yarn up`. If the user wants to apply a bump, they will ask.

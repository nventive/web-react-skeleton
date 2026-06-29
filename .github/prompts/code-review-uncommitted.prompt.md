---
description: Review uncommitted changes (working tree + staged) against the project's standards and Copilot instructions.
mode: agent
---

# Code review — uncommitted changes

Review the user's **uncommitted** work (working tree + staged). Do not modify files.

## Steps

1. Inventory the changes:
   - Run `git status --short` to see which files are modified / added / deleted / renamed.
   - Run `git diff HEAD` to read the actual content changes (both staged and unstaged).
2. Resolve the rules each changed file is subject to:
   - **Every** file: the repo-wide [`/.github/copilot-instructions.md`](../copilot-instructions.md).
   - For each file under `frontend/**`: match its path against the `applyTo` glob on every file in `.github/instructions/frontend*.instructions.md` and pick the ones that match. Treat the matching instructions as authoritative.
3. Review each change against the applicable rules.
4. Group findings by severity (see below) and end with a short "What looks good" summary.

## What to look for

For any changed file (focused on, but not limited to, the items below):

- **TypeScript escapes:** `any`, `as any`, `as unknown as X`, suppressions (`@ts-ignore`, `@ts-expect-error` without a comment).
- **Styling violations:** inline `style={…}` for non-theme values, `!important` without a comment, hardcoded hex/named colours in CSS Modules, selectors targeting MUI internals (`.MuiButton-root` etc.), `sx` prop usage.
- **Security:** `dangerouslySetInnerHTML`, secrets in code or env files, `VITE_*` env vars used to expose sensitive values, PII in fixtures, real credentials in commit messages.
- **i18n:** hardcoded user-facing strings, the same key translated in both parent and child, branching on `count` instead of plural keys, keys added to `en` only (check `fr` parity).
- **Accessibility:** interactive elements without an accessible name, removed focus outlines, broken heading order, `tabIndex > 0`, `div`/`span` used where a `<button>` / `<a>` belongs.
- **State / React:** new shared state added to a single bloated context, contexts without `useMemo` on the value, missing dependency arrays, async work inside `useEffect` without cleanup, React Router used via `window.location`.
- **Testing:** new logic added with no test, `fireEvent` where `userEvent` was appropriate, queries by class/test-id when `getByRole` would work, snapshots of large trees, mocked `useTranslation`.
- **Errors:** missing error handling at system boundaries (network/storage), `try { … } catch { /* swallow */ }`, error messages exposing internals.
- **Folder layout:** files in the wrong folder (presentational components under `pages/`, or vice versa), empty placeholder folders being introduced.
- **Build hygiene:** new dependencies added without a clear need (challenge "just in case" deps), `package-lock.json` or `pnpm-lock.yaml` introduced alongside `yarn.lock`.

## Severities

- **Blocker** — must fix before merge (security issue, broken type safety, missing translation, accessibility regression, secrets leaked).
- **Major** — should fix before merge (clear convention violation, missing test on new branching logic, performance footgun in a render path).
- **Minor** — nice to fix (naming, locality, small simplification).
- **Nit** — purely subjective polish; reviewer can accept "no".

For every finding, include:
- The file and (when applicable) the line range.
- Which rule it violates (link to the instruction file when the rule lives there).
- A concrete suggested change.

## Output shape

```
### Blockers
- frontend/src/app/pages/HomePage/HomePage.tsx (L42-L48): uses `dangerouslySetInnerHTML`. Forbidden by frontend.instructions.md §6. Render the parsed content via a sanitiser + plain JSX instead.

### Major
- …

### Minor
- …

### Nits
- …

### What looks good
- Translations added to both `en` and `fr`.
- New `LanguageSwitcher` test uses `getByRole` and `userEvent`.
```

If there are no findings in a severity, omit the section (don't write "none").

## Out of scope for this review

- Do **not** edit files.
- Do **not** run the build, tests, or any installer.
- Do **not** comment on style choices that are already auto-fixed by Prettier / ESLint / Stylelint — those will be caught by CI.

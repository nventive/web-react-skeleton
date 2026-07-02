---
name: add-page
description: "Add a new page to the web-react-skeleton React SPA. Use when: creating a new page, adding a new route, adding a protected/authenticated screen, adding a public screen, wiring a new URL, registering a new EPermission, or scaffolding a page folder under frontend/src/app/pages/. Enforces the three-file page pattern (Page.tsx + page.route.tsx + withAuthPage.tsx), locale-prefixed i18n paths, EPermission wiring, and routes.ts registration."
argument-hint: "<PageName> [public|protected] — e.g. 'Profile protected'"
---

# Add a Page

Add a new page to the React SPA under `frontend/src/app/pages/<pageName>/` following the project's route + i18n + auth conventions.

## When to Use

- User asks to "add a page", "create a new route", "add a screen", or "scaffold a page".
- User wants to add a protected/authenticated area behind an `EPermission`.
- User wants to add a public page (like `login`).
- User references adding to `pages/`, `routes/`, or a new `EPermission` value.

Do **not** use this skill for:
- Editing an existing page's contents (just edit the file).
- Adding a component or container (see `components-vs-containers.instructions.md`).
- Changing routing infrastructure itself (`Router.tsx`, `findRoute.ts`).

## Inputs to Confirm

Before starting, confirm with the user (ask only what's missing):

1. **Page name** in `PascalCase` (e.g. `Profile`, `Settings`, `UserDetail`). The folder will be `lowerCamelCase`.
2. **Access**: `public` (no auth, routed directly) or `protected` (wrapped by `withAuth` with an `EPermission`).
3. **Dynamic segments?** e.g. `/users/:id`. If yes, capture the param name(s).
4. **Dev-only?** If the page should only mount when `__ENV__ !== "prod"` (like `uikit`).

If the user asked with a one-word name and gave no other info, default to `protected`, no dynamic segments, all envs — and mention the assumption in your summary.

## The Page Pattern (Ground Truth)

A page is always three files (two if public):

```
frontend/src/app/pages/<pageName>/
├── <PageName>.tsx          # presentational component, default export
├── <pageName>.route.tsx    # IRoute object, default export
└── withAuth<PageName>.tsx  # protected pages ONLY — pure composition
```

Public pages skip `withAuth<PageName>.tsx` and point `route.component` directly at the page.

## Procedure

Follow every step in order. Do not skip.

### 1. Verify inputs and derive names

From the `PageName` (PascalCase), derive:
- `pageName` — lowerCamelCase (folder + route file + `withAuth<PageName>` const name)
- `folder` — `frontend/src/app/pages/<pageName>/`
- `permission` — `<PageName>Read` (protected only)

Do **not** copy the existing typo `dashbaord/` — that folder name is a known bug; use the correct spelling for any new page.

### 2. Add i18n keys (BLOCKER — do this first)

The `.route.tsx` file references locale JSON keys at compile time. Missing keys will fail typing.

Two keys are required for every page:
- `routes__<pageName>` — the URL segment (e.g. `"profile"` / `"profil"`).
- `<pageName>__page_title` — the browser tab title (e.g. `"Profile"` / `"Profil"`).

Locale JSONs are **generated** by `yarn sheet2i18n` from a Google Sheet. See [i18n.instructions.md](../../instructions/i18n.instructions.md).

Tell the user:
> "Add these keys to the sheet, then run `yarn sheet2i18n`:
> - `routes__<pageName>` (en + fr)
> - `<pageName>__page_title` (en + fr)
> Any additional UI text keys the page needs."

If the user cannot update the sheet right now, ask whether to (a) pause until keys exist, or (b) scaffold everything and let the user add keys later — they will see TS errors on the `.route.tsx` file until the JSON regenerates. Never hand-edit `assets/locales/*.json`.

### 3. Create the page component

Use [assets/Page.tsx.template](./assets/Page.tsx.template) as the starting point. Replace `__PageName__` and `__pageName__` placeholders.

Rules (from [react.instructions.md](../../instructions/react.instructions.md) and [components-vs-containers.instructions.md](../../instructions/components-vs-containers.instructions.md)):
- Declare with `function PageName()`, not an arrow function.
- Single `export default`.
- Wrap the content in `<Layout.Container>` (or `<Layout.Auth>` for auth-style pages like login).
- Call `useTranslation()` for every user-facing string.
- Pages MAY use `@stores`, `@services`, and router hooks — that is what makes them pages (not components).
- Use path aliases only. No relative imports across folders.

### 4. Create the route file

Use [assets/page.route.tsx.template](./assets/page.route.tsx.template). Replace placeholders.

Rules:
- File name is `<pageName>.route.tsx` (lowerCamelCase, `.route.tsx` suffix).
- Default export named `<pageName>Route`.
- `name` field ends in `__page_title`.
- `paths` MUST use the pattern:
  ```ts
  en: `/${en.locale__key}/${en.routes__<pageName>}`
  fr: `/${fr.locale__key}/${fr.routes__<pageName>}`
  ```
- For **protected** pages, `component: lazy(() => import("./withAuth<PageName>"))`.
- For **public** pages, `component: lazy(() => import("./<PageName>"))`.
- For **dynamic** routes, append `/:paramName` to each path AND add a `getPath` function that produces a fully-substituted URL for a given locale — see the template comments.

### 5. Create the auth wrapper (protected pages only)

Use [assets/withAuthPage.tsx.template](./assets/withAuthPage.tsx.template). Replace placeholders.

Rules:
- Pure composition: `const withAuth<PageName> = withAuth(<PageName>, EPermission.<PageName>Read);`
- No JSX, no hooks, no logic. If you want to add anything else, stop — it belongs in `AuthProvider` or the page itself.
- Default export.

Skip this file entirely for public pages.

### 6. Register the permission (protected pages only)

Edit `frontend/src/app/enums/EPermission.ts`. Add an entry preserving alphabetical/logical order used in the file:

```ts
<PageName>Read = "<PageName>Read",
```

Skip for public pages.

### 7. Register the route

Edit `frontend/src/app/routes/routes.ts`:

1. Add the import at the top with the other page-route imports (keep them sorted):
   ```ts
   import <pageName>Route from "@pages/<pageName>/<pageName>.route";
   ```
2. Add to the `routes` array. For dev-only pages, add inside the existing `if (__ENV__ !== "prod")` block instead of the top-level array.

Do **not** register the page in `Router.tsx` — it reads from `routes.ts`. The only route registered directly in `Router.tsx` is `notFoundRoute`; do not touch it.

### 8. Verify

Run these in order from `frontend/`:

1. `yarn lint:scripts` — catches missing imports, type errors, unused vars.
2. `yarn build` — full type check via `tsc -b`. This will fail loudly if the i18n keys from step 2 are not yet in the locale JSONs.
3. `yarn dev` and navigate to `/<locale>/<url-segment>` in both `en` and `fr`.

If TS errors point at `en.routes__<pageName>` or `en.<pageName>__page_title` being missing, the user has not run `yarn sheet2i18n` yet — remind them, do not hand-edit the JSONs.

## Completion Checklist

Before reporting done, verify all apply:

- [ ] Folder `frontend/src/app/pages/<pageName>/` exists.
- [ ] `<PageName>.tsx` exists, uses `function` keyword, default export, `useTranslation`, and `<Layout.Container>` (or `.Auth`).
- [ ] `<pageName>.route.tsx` exists, default export named `<pageName>Route`, both `en` and `fr` paths use the locale-key pattern.
- [ ] **Protected only**: `withAuth<PageName>.tsx` exists and is pure composition.
- [ ] **Protected only**: `EPermission.<PageName>Read` added to `EPermission.ts`.
- [ ] Route is imported and pushed in `routes.ts` (in the right block for dev-only).
- [ ] User has been told which i18n keys to add to the sheet (or they were added already).
- [ ] `yarn lint:scripts` passes.
- [ ] `yarn build` passes (or fails only on the pending i18n keys).

## Anti-patterns to Reject

- Hand-editing `assets/locales/*.json` — always regenerate via `yarn sheet2i18n`.
- Registering the page directly in `Router.tsx` instead of `routes.ts`.
- Putting auth logic (permission checks, redirects) inside the page component — it belongs in `withAuth` / `AuthProvider`.
- Using a relative import like `../../components/...` — always use path aliases (`@components/...`, etc.).
- Copying the existing `dashbaord/` typo into new names.
- Importing icons from `@mui/icons-material` — every icon is a hand-wrapped SVG under `@icons/*`.
- Adding a state library, form library, or i18n library — the stack is fixed (Zustand / Yup / i18next).

## References

- [routing-and-auth.instructions.md](../../instructions/routing-and-auth.instructions.md) — route + auth rules.
- [react.instructions.md](../../instructions/react.instructions.md) — component rules.
- [components-vs-containers.instructions.md](../../instructions/components-vs-containers.instructions.md) — what may live in a page vs a component.
- [i18n.instructions.md](../../instructions/i18n.instructions.md) — key naming and `sheet2i18n` workflow.
- [typescript.instructions.md](../../instructions/typescript.instructions.md) — naming, aliases, strictness.

---
name: add-container
description: "Add a new container to the web-react-skeleton React SPA. Use when: creating a new container, adding stateful UI that talks to a Zustand store / service / router / localStorage, wrapping presentational components with orchestration, scaffolding a folder under frontend/src/app/containers/, adding a provider, adding a banner/modal/consent widget, promoting a component to a container, or extracting business logic out of a presentational component. Enforces the container folder layout (containers/<name>/<Name>.tsx + optional <name>.config.ts / <name>Helper.ts / interfaces/ / private sub-component subfolders), the components-vs-containers import allowlist (containers may import stores/services/router; components may not), the no-heavy-markup rule, the private-sub-component rule (promote to @components on second consumer), and the container-is-not-a-page rule (no routes.ts registration, no withAuth, no lazy)."
argument-hint: "<ContainerName> — e.g. 'CartDrawer' or 'CartDrawer, orchestrates the cart store + navigate to checkout'"
---

# Add a Container

Add a new container under `frontend/src/app/containers/<containerName>/` following the "stateful orchestration, no visuals of its own" convention.

## When to Use

- User asks to "add a container", "create a container", "add a provider", "add a banner/modal/consent", or scaffolds a folder under `containers/`.
- User has a piece of UI that needs a **store** (`useUserStore`), a **service** (`postLogin`), the **router** (`useNavigate`, `useParams`, `useLocation`), `localStorage` / `sessionStorage`, or an env var — but is not itself a route target.
- User is about to import `@stores/*` / `@services/*` / `react-router-dom` inside a file under `@components/*` (that file is a container in the wrong folder — move it).
- User is promoting a `@components/*` file that has grown a store dep or an `useEffect` doing I/O.

Do **not** use this skill for:
- A **route target** (has a URL, is registered in `routes.ts`) — use `add-page`.
- A **form** (Yup schema + `<form onSubmit>`) — use `add-form`.
- A **presentational primitive** (no store/service/router imports, no I/O) — that's a component; use `add-mui-component` or edit `@components/*` directly.
- Extracting one function out of an existing container — just add the helper next to it (no skill needed).

## The Container Pattern (Ground Truth)

**One folder, one container.** The folder can grow its own private subtree. Minimum is a single file:

```
containers/
  <containerName>/                       # lowerCamelCase folder
    <ContainerName>.tsx                  # PascalCase file, default export = the container
```

Full pattern (only add what you need):

```
containers/
  <containerName>/
    <ContainerName>.tsx                  # the container (default export)
    <containerName>.config.ts            # static config (constants, tables)
    <containerName>Helper.ts             # pure helpers (localStorage I/O, parsing)
    interfaces/
      I<Model>.ts                        # one interface per file, I-prefixed
    <subComponentName>/                  # PRIVATE sub-component subfolder (lowerCamelCase)
      <SubComponentName>.tsx             # PascalCase file
      <sub-component-name>.module.css    # optional colocated styles
```

Real examples in the repo:
- `containers/authProvider/AuthProvider.tsx` — single file, wraps children with an auth check.
- `containers/debugBanner/DebugBanner.tsx` + `debug-banner.module.css` — single container with one style file.
- `containers/cookieConsent/` — full pattern: `CookieConsent.tsx` + `cookieConsent.config.ts` + `cookieConsentHelper.ts` + `interfaces/*` + private `cookieBanner/` and `cookieModal/` sub-component folders.

## Inputs to Confirm

Before generating any files, confirm with the user (ask only what's missing):

1. **Container name** in `PascalCase` (e.g. `CartDrawer`, `SessionTimer`, `FeatureFlagProvider`). Folder name is the same in `lowerCamelCase` (`cartDrawer/`).
2. **What state / side effects does it own?** Store reads/writes, service calls, `localStorage` keys, router interactions, env checks. If the answer is "none", it's a component, not a container — stop.
3. **Does it wrap children (`children: ReactNode`)** or render fully on its own? Providers wrap; banners/modals don't.
4. **Does it need private sub-components?** If it produces visible UI more complex than `<>{children}</>` or a single component call, the visuals should be a presentational sub-component (private under this container) or an existing `@components/*`.
5. **Consumers** — where will it be mounted? `App.tsx`, a specific page, `Router.tsx`, an HOC. The container is not registered anywhere central; the consumer imports it directly.

If the container needs a **new i18n key** or a **new store**, invoke `add-i18n-key` / `add-store` first (or in the same session) — do not scaffold against placeholders.

## Procedure

Follow every step in order.

### 1. Confirm it's actually a container (not a component / page / form)

Run the decision checklist from [components-vs-containers.instructions.md](../../instructions/components-vs-containers.instructions.md#decision-checklist). First "yes" wins:

1. Does it read/write a Zustand store? → **container**
2. Does it call a service (axios) or `localStorage` / `sessionStorage`? → **container**
3. Does it use `useNavigate`, `useParams`, `useLocation`? → **container** (or a page)
4. Does it fetch data on mount, or run business logic in `useEffect`? → **container**
5. Does it need to know about the current user, permissions, cookie consent, or environment? → **container**
6. Would a design-system Storybook page render it without any providers besides theme/i18n? → **component** (stop this skill)
7. Can it be reused on multiple pages, receiving different data via props? → **component** (stop this skill)

If it also has a URL → **page**, not a container. Stop this skill and invoke `add-page`.

If genuinely unsure, start as a `@components/*` file. Promoting a component to a container later is cheap; extracting a component from a container is not.

### 2. Verify prerequisites exist

Before creating files, confirm each dependency exists:

- **Stores** the container consumes (`@stores/*`). Missing → invoke `add-store` first.
- **Services** the container calls (`@services/*`). Missing → invoke `add-service` first.
- **i18n keys** used by the container. Missing → invoke `add-i18n-key` first.
- **Presentational sub-components** it composes. If they exist in `@components/*`, reuse them. If they'll be private to this container, plan the sub-component subfolder(s) in step 4.

### 3. Create the container file

Create `frontend/src/app/containers/<containerName>/<ContainerName>.tsx`.

Rules (from [components-vs-containers.instructions.md](../../instructions/components-vs-containers.instructions.md#what-belongs-in-containers) + [react.instructions.md](../../instructions/react.instructions.md) + [typescript.instructions.md](../../instructions/typescript.instructions.md)):

- **Default export** = a named function matching the file name in `PascalCase`.
- **Props interface** inline as `I<ContainerName>`, `I`-prefixed. If the container has no props, omit the interface.
- **Absolute imports** via aliases (`@stores/*`, `@services/*`, `@components/*`, `@icons/*`, `@shared/*`, `@enums/*`, `@pages/*`, `@routes/*`). Never relative across folders. For **private sub-components under this container**, relative imports (`./cookieBanner/CookieBanner`) are used in the repo — either works, be consistent within the file.
- **Orchestration only.** The body reads stores, calls services, navigates, sets `localStorage`, and renders **either** a single component / composed sub-components / `children` — with **no `styled()` blocks, no big JSX trees, no new `.scss` file at container level** unless a single thin wrapper `div` is unavoidable (see `DebugBanner` for the exception, not the rule).
- `useEffect` may perform I/O (service call, localStorage read, subscription). Include the full dependency array; ESLint enforces this.
- `useCallback` for handlers passed to sub-components.
- `useTranslation` from `react-i18next` when needed; translate at the call site, pass strings down. Reserved key rule: URL-related lookups use `t("locale__key")` (see [i18n.instructions.md](../../instructions/i18n.instructions.md)).
- **Toasts** use stable `toastId`s (see [i18n.instructions.md](../../instructions/i18n.instructions.md#error-and-toast-copy) + [services-api.instructions.md](../../instructions/services-api.instructions.md)).
- **Service call shape** in an effect: `.then(({ data }) => …).catch((error) => { … }).finally(...)`. Handle known errors first (e.g. `error.response?.status === 401`), fall back to `toast.error(t("errors__generic"), { toastId: "generic" })`. Do **not** wrap the service in `try/catch` — services already normalize errors.
- **Router navigation** uses `useNavigate` + `<route>.paths[t("locale__key")]`:
  ```tsx
  navigate(loginRoute.paths[t("locale__key")], { replace: true });
  ```

Reference skeletons:
- **Wraps children (provider):** see `containers/authProvider/AuthProvider.tsx`.
- **Standalone widget:** see `containers/cookieConsent/CookieConsent.tsx`.
- **Env-gated banner with localStorage:** see `containers/debugBanner/DebugBanner.tsx`.

### 4. Add sub-artefacts only if needed

Add each of these **only** when the container has enough surface to justify it. Do not scaffold empty files.

**`<containerName>.config.ts`** — static config (arrays, constants, lookup tables) consumed by the container and its sub-components. Default export or named exports; either matches the repo (`cookieConsent.config.ts` uses a default export).

**`<containerName>Helper.ts`** — pure functions that live outside React (localStorage getters/setters, parsers, predicate helpers). Named exports only. Example: `cookieConsentHelper.ts` exports `COOKIE_PREFERENCES`, `getCookieConsentPreferences`, `setCookiePreferencesInStorage`, `hasConsent`. Helpers may be imported by other files outside the container (`hasConsent` is imported by `App.tsx`).

**`interfaces/I<Model>.ts`** — domain types used by this container. **One interface per file**, `I`-prefixed. Consumed via `@containers/<containerName>/interfaces/I<Model>` alias imports.

**`<subComponentName>/<SubComponentName>.tsx` (+ optional `.module.css`)** — a **private** presentational sub-component owned by this container. Rules:
- Sub-component is a **regular presentational component** (see [components-vs-containers.instructions.md](../../instructions/components-vs-containers.instructions.md#what-belongs-in-components)) — no store/service/router imports, no I/O. If it needs any of those, either promote its logic up into the container or split off another container.
- Sub-component subfolder is `lowerCamelCase`; file is `PascalCase.tsx`.
- Colocated `.module.css` uses `kebab-case` naming (`cookie-banner.module.css`) or SCSS if the component's styling calls for BEM (see [styling.instructions.md](../../instructions/styling.instructions.md)).
- **Only imported by the parent container.** If a second consumer wants it, follow step 6 (promote to `@components/*`).

### 5. Wire the container into its consumer

The container is not registered anywhere central. The consumer imports it directly:

- **App-wide widget** (cookie banner, feature flag provider) → `App.tsx`.
- **Auth wrapper** → the `withAuth` HOC (`hocs/withAuth.tsx`).
- **Dev-only banner** → `routes/Router.tsx` behind an `__ENV__` check.
- **Page-scoped orchestration** → the specific page under `@pages/*`.

Example:

```tsx
// App.tsx
import CookieConsent from "@containers/cookieConsent/CookieConsent";
// …
return (
  <>
    <Router />
    <CookieConsent />
  </>
);
```

If the container wraps children, its consumer wraps its own subtree:

```tsx
<AuthProvider permission={permission}>
  <PageComponent />
</AuthProvider>
```

Do **not**:
- Register the container in `@routes/routes.ts` (that's for pages).
- Wrap the container in `withAuth` (that's for pages).
- Lazy-load the container with `React.lazy` (that's for pages).
- Add a `*.route.tsx` file next to it.

### 6. Watch for the "promote to component" trigger

The moment a private sub-component gets a **second consumer** (outside its owning container), move it:

1. Create `@components/<subName>/<SubName>.tsx` (+ colocated styles if any).
2. Update the original container's import to the new `@components/*` path.
3. **Delete** the private copy under `containers/<containerName>/<subName>/`.
4. If it's a wrap of an MUI primitive, invoke `add-mui-component` to also register it in the UiKit page.

Never keep two copies of the same component.

### 7. Verify

From `frontend/`:

1. **`yarn lint:scripts`** — catches disallowed imports (`@components/*` importing from `@stores/*` is flagged by structure; `@containers/*` importing from `@components/*` is allowed).
2. **`yarn build`** — full type check via `tsc -b`.
3. **`yarn dev`** and exercise the container:
   - The consumer mounts it (App / page / HOC / Router).
   - State reads (stores, `localStorage`, URL params) resolve without a null-flash.
   - Service calls succeed → the expected UI renders; fail → the expected `toast.error` fires exactly once per burst (stable `toastId`).
   - Navigation calls land on the right localized URL (`/en/...` or `/fr/...`).
4. **Grep sanity check** for the container name across the repo: exactly one definition, at least one consumer.

## Completion Checklist

Before reporting done, verify all apply:

- [ ] Folder `frontend/src/app/containers/<containerName>/` exists, `lowerCamelCase`.
- [ ] `<ContainerName>.tsx` exists, `PascalCase` file, default export = a named function.
- [ ] Props interface (if any) is inline, `I`-prefixed, and named `I<ContainerName>`.
- [ ] Container imports at least one of: `@stores/*`, `@services/*`, `react-router-dom` router hooks, `localStorage` / `sessionStorage`, or an env var. If it imports **none** of those, it's a component — move it.
- [ ] Container does **not** introduce a `styled()` block, a large JSX tree, or a new `.scss` file for reusable visuals. Reusable visuals live in `@components/*` or in a private sub-component folder.
- [ ] Optional `<containerName>.config.ts` / `<containerName>Helper.ts` / `interfaces/I<Model>.ts` files exist only if they carry real content.
- [ ] Private sub-components live under `<subComponentName>/<SubComponentName>.tsx` and are only imported by the parent container.
- [ ] Service calls in effects use `.then/.catch/.finally`, not `try/catch`, and specific errors are handled before falling back to `errors__generic`.
- [ ] `toast.error(...)` calls include a stable `toastId`.
- [ ] Navigation uses `<route>.paths[t("locale__key")]`, never a hard-coded URL string.
- [ ] The container is **not** in `@routes/routes.ts`, not wrapped in `withAuth`, not lazy-loaded, and has no `*.route.tsx` sibling.
- [ ] At least one consumer imports it (`App.tsx`, a page, `Router.tsx`, `withAuth`, or another container).
- [ ] `yarn lint:scripts` passes.
- [ ] `yarn build` passes.

## Anti-patterns to Reject

- Placing a file that imports `@stores/*` / `@services/*` / `react-router-dom` router hooks under `@components/*` — that's a container in the wrong folder.
- Placing a file with no store / service / router / I/O dep under `@containers/*` — that's a component; move it to `@components/*`.
- Registering the container in `@routes/routes.ts`, adding a `*.route.tsx`, or wrapping it in `withAuth` — those belong to pages.
- Lazy-loading the container with `React.lazy` — only pages are lazy-loaded.
- Growing a container into a `div`-soup of layout + `styled()` blocks — extract the visuals as a private sub-component or a `@components/*` file, leave the container as orchestration.
- Making a private sub-component reach into a store or service — private sub-components are presentational only. Push the logic up to the parent container.
- Keeping two copies of a sub-component after a second consumer appears — promote to `@components/*` and delete the private copy.
- Wrapping the service call in `try/catch` — services already normalize errors; use `.then/.catch/.finally`.
- `toast.error(...)` without a `toastId` — duplicate toasts stack.
- Hard-coded URL strings in `navigate(...)` — always `<route>.paths[t("locale__key")]`.
- Reading the locale from `navigator.language` or `location.pathname.split("/")[1]` — always `t("locale__key")`.
- Nesting more than one component under a single container folder (e.g. two `.tsx` files at the folder root) — one folder, one container. Sub-components go in their own subfolder.
- Relative imports across folders (e.g. `../../stores/userStore`) — always alias.
- Defining container-scoped interfaces under `@shared/interfaces/*` — keep them under the container's own `interfaces/` folder.

## References

- [components-vs-containers.instructions.md](../../instructions/components-vs-containers.instructions.md) — the full rules this skill enforces, incl. the decision checklist and import allowlist table.
- [react.instructions.md](../../instructions/react.instructions.md) — component shape, hooks, `useCallback`, `Dispatch<SetStateAction>` typing.
- [typescript.instructions.md](../../instructions/typescript.instructions.md) — `I` prefix, one interface per file, alias imports.
- [state-stores.instructions.md](../../instructions/state-stores.instructions.md) — which layers may import `@stores/*`; hydration / reset patterns for `AuthProvider`.
- [services-api.instructions.md](../../instructions/services-api.instructions.md) — service call shape used in `useEffect`.
- [routing-and-auth.instructions.md](../../instructions/routing-and-auth.instructions.md) — navigation, `AuthProvider`, `withAuth` HOC.
- [styling.instructions.md](../../instructions/styling.instructions.md) — when a colocated `.module.css` / `.scss` is acceptable on a container or its sub-components.
- [i18n.instructions.md](../../instructions/i18n.instructions.md) — reserved keys, toast `toastId` convention.
- `add-store`, `add-service`, `add-i18n-key`, `add-mui-component`, `add-page` skills — invoked when a prerequisite or consumer is missing.

---
description: How to decide between a component and a container, and the folder/import rules for each.
applyTo: "frontend/src/app/{components,containers}/**/*.{ts,tsx}"
---

# Components vs Containers

Scope: everything under `@components` and `@containers`. This file exists because the two folders look similar but exist for opposite reasons — mixing them is the fastest way to make a piece of UI un-reusable.

Complementary files (do not repeat their content here):
- [react.instructions.md](react.instructions.md) — how to write the component itself, hooks, JSX.
- [typescript.instructions.md](typescript.instructions.md) — naming, interfaces, path aliases.
- [styling.instructions.md](styling.instructions.md) — SCSS/BEM/utility classes.
- [mui-and-uikit.instructions.md](mui-and-uikit.instructions.md) — MUI wrappers and uikit registration.
- [forms.instructions.md](forms.instructions.md) — the third sibling folder alongside components and containers.
- [state-stores.instructions.md](state-stores.instructions.md) — which layers may import `@stores/*`.

---

## The one-sentence rule

- **Component (`@components`)** = **how things look**. Reusable, dumb, no knowledge of the app.
- **Container (`@containers`)** = **how things work**. Owns state, talks to stores/services/router, composes components.

If you find yourself importing a store, service, or router hook inside `@components`, you are writing a container in the wrong folder. Move it.

---

## Decision checklist

Answer top-to-bottom. First "yes" wins.

1. Does it read/write a Zustand store? → **container**
2. Does it call a service (axios) or `localStorage` / `sessionStorage`? → **container**
3. Does it use `useNavigate`, `useParams`, `useLocation`? → **container** (or a page).
4. Does it fetch data on mount, or run business logic in `useEffect`? → **container**
5. Does it need to know about the current user, permissions, cookie consent, or environment? → **container**
6. Would a design-system Storybook page render it without any providers besides theme/i18n? → **component**
7. Can it be reused on multiple pages, receiving different data via props? → **component**

If the answer is genuinely "I don't know", start as a component. Promoting a component to a container is easy; extracting a component out of a container is harder.

---

## What belongs in `@components/`

Presentational only. Every folder under `@components/*` in the repo follows this shape.

**Allowed:**
- `useState` for **UI-only** state (open/closed, focused, hovered, controlled input value passed back via `onChange`).
- MUI primitives, styled components (see `mui-and-uikit.instructions.md`).
- Props typed as `I<Component> extends <MuiProps>` (see [react.instructions.md](react.instructions.md)).
- `useTranslation` **only if** the component owns the translation of its own hard-coded text (rare — usually labels come from the parent per the "translate in parent" rule). Prefer receiving pre-translated strings as props.

**Not allowed:**
- Imports from `@stores`, `@services`, `@routes`, `@pages`, `@forms`, `@containers`, `@hocs`.
- `useNavigate`, `useLocation`, `useParams`.
- `localStorage`, `sessionStorage`, `document.cookie`, `window.location` mutations.
- Reading `import.meta.env` or `__ENV__` / `__API_URL__` / other Vite globals.
- `useEffect` that performs I/O or navigation.
- Business logic (validation rules, permission checks, currency math).

Each component folder holds **one** component:

```
components/
  <name>/
    <Name>.tsx
    <name>.scss        <-- optional, colocated (see styling instructions)
```

New MUI wrappers must be registered in the UiKit page (`@pages/uikit`) — see [mui-and-uikit.instructions.md](mui-and-uikit.instructions.md).

---

## What belongs in `@containers/`

Stateful orchestration. Wraps children, feeds them data, handles side effects.

**Expected to do:**
- Own non-trivial state (`useState`, `useReducer`) and pass it down.
- Talk to Zustand stores (`useUserStore`, etc.).
- Call services (`postLogin`, `getMe`), handle their promises, translate errors to `toast`.
- Navigate (`useNavigate`), read the URL (`useParams`), react to route changes.
- Read `localStorage` / cookies / env vars.
- Compose presentational components — usually **no markup of its own** beyond a fragment or a thin wrapping `div`.

**Expected NOT to do:**
- Introduce new styled components or `.scss` files for a look that could be a reusable component. If the visual is worth reusing, extract a component under `@components/`.
- Contain deep JSX trees full of styling. If the container has more than a couple of `div`s doing layout, that layout probably belongs in a component.

A container typically reads `localStorage` and a store, calls a service, navigates on failure, and renders either a loading state or its children — with zero styling of its own.

### Container folder layout

Containers can grow their own private subtree. The full pattern:

```
containers/
  <containerName>/
    <ContainerName>.tsx              <-- the container (default export)
    <containerName>.config.ts        <-- static config
    <containerName>Helper.ts         <-- pure helpers (I/O + parsing)
    interfaces/
      I<Model>.ts                    <-- domain interfaces used by this container
    <subComponentName>/
      <SubComponentName>.tsx         <-- private presentational sub-component
      <sub-component-name>.module.css
```

Rules that pattern encodes:
- The container is the **only** thing exported for external use.
- Sub-components live in **lowerCamelCase subfolders** with a **PascalCase file**, and are imported only by their parent container. If a sub-component becomes reusable outside the container, move it to `@components/` and delete the private copy.
- Colocated helpers (`*Helper.ts`), config (`*.config.ts`), and `interfaces/` are the norm. Do not create parallel top-level folders under `@shared` for container-scoped concerns.
- Interfaces exported from a container are still `I`-prefixed and one-per-file (see [typescript.instructions.md](typescript.instructions.md)).

---

## Containers vs Pages

`@pages` is a third folder that people often confuse with `@containers`.

| | Container | Page |
|---|---|---|
| Purpose | Reusable stateful piece of UI | A route target |
| Registered in `routes.ts` | No | Yes |
| Wrapped by `withAuth` HOC when protected | No | Yes (via `withAuth<Page>.tsx`) |
| Lazy-loaded | No | Yes (`lazy(() => import(...))`) |
| Can be rendered by multiple pages | Yes | No |

Rule of thumb: if the thing has a URL, it's a page. If it's mounted by a page (or by another container), it's a container.

Pages and their `*.route.tsx` / `withAuth<Page>.tsx` files are covered by `routing-and-auth.instructions.md`.

---

## Common mistakes and how to fix them

### 1. "Smart component" — component with a store dep

```tsx
// Bad — components/userGreeting/UserGreeting.tsx
import { useUserStore } from "@stores/userStore";
export default function UserGreeting() {
  const { user } = useUserStore();
  return <span>Hello, {user?.firstName}</span>;
}
```

Fix: keep the component dumb, move the store read up.

```tsx
// components/userGreeting/UserGreeting.tsx
interface IUserGreeting { name?: string; }
export default function UserGreeting({ name }: IUserGreeting) {
  return <span>Hello, {name}</span>;
}

// caller (page or container)
const { user } = useUserStore();
<UserGreeting name={user?.firstName} />
```

### 2. "Layout container" — container with heavy markup

If your container has a `div`-soup that looks like design work, the markup is a component. Keep the container as pure orchestration:

```tsx
// containers/checkout/Checkout.tsx
export default function Checkout() {
  const { items, total } = useCartStore();
  const onSubmit = useCallback(/* ... */, []);
  return <CheckoutSummary items={items} total={total} onSubmit={onSubmit} />;
}

// components/checkoutSummary/CheckoutSummary.tsx — all the JSX + styling
```

### 3. Sub-component that got reused

A private sub-component under `containers/<name>/<subName>/` stays private until a second consumer appears. The moment it does, promote it:

```
components/<subName>/
  <SubName>.tsx
  <sub-name>.scss
```

...and delete the private copy from the container.

### 4. Business logic inside a component

A component asking "is this user allowed to see the button?" is a container in disguise. The component should receive `showButton: boolean` and render it; the container computes the boolean from `useUserStore()` / `EPermission`.

---

## Import allowlist summary

| From ↓  /  To → | `@components` | `@containers` | `@stores` | `@services` | `@routes` / `@pages` | `@hocs` | `@shared` / `@enums` | MUI / third-party |
|---|---|---|---|---|---|---|---|---|
| `@components/*` | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ (types, constants only) | ✅ |
| `@containers/*` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

If an import you need is a ❌ from `@components/*`, the file belongs in `@containers/*` (or `@pages/*`) instead.

---

## Not sure?

Don't take the component vs container separation as a dogma — sometimes the line is hard to draw. Default to a component. Move it to a container only when it starts needing the app to work.

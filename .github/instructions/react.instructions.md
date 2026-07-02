---
description: React conventions for the frontend (components, hooks, JSX, composition).
applyTo: "frontend/src/**/*.tsx"
---

# React conventions

Scope: all `.tsx` files under `frontend/src`.

Complementary files (do not repeat their content here):
- [typescript.instructions.md](typescript.instructions.md) — typing, naming, path aliases.
- [styling.instructions.md](styling.instructions.md) — SCSS / BEM / utility classes / theme tokens.
- [mui-and-uikit.instructions.md](mui-and-uikit.instructions.md) — MUI wrapping and uikit registration.
- [components-vs-containers.instructions.md](components-vs-containers.instructions.md) — where each component / container / form lives.
- [routing-and-auth.instructions.md](routing-and-auth.instructions.md) — routes, `withAuth`, and `EPermission`.
- [forms.instructions.md](forms.instructions.md) — the full form recipe (this file only summarizes it).
- [state-stores.instructions.md](state-stores.instructions.md) — Zustand for global state.
- [i18n.instructions.md](i18n.instructions.md) — the "translate in parent, pass a string down" rule.

The project uses React 18 with `<StrictMode>`, `react-router-dom` v6, `react-i18next`, and MUI v6 with Pigment-CSS.

---

## Components are always functional

- **Only functional components.** No class components.
- Use the `function` keyword (not an arrow function) for the component itself. This gives cleaner stack traces and matches every existing component in the repo.
- One default export per file, and the file name matches it (`Button.tsx` → `export default function Button`).
- Private helper components live above the exported one in the same file; do not export them.

```tsx
// Canonical wrapper: styled() + interface extending MUI props
import { ButtonProps, Button as MuiButton } from "@mui/material";
import { styled } from "@mui/material-pigment-css";

const StyledMuiButton = styled(MuiButton)(({ theme }) => ({
  borderRadius: theme.customProperties.borderRadius.xs,
}));

interface IButton extends ButtonProps {
  target?: string;
}

export default function Button({ children, ...props }: IButton) {
  return <StyledMuiButton {...props}>{children}</StyledMuiButton>;
}
```

Avoid:
- `React.FC` / `React.FunctionComponent` — type props inline via `IProps`.
- `defaultProps` — use destructuring defaults instead.
- `forwardRef` unless you actually need to expose a DOM ref to a parent.

---

## Props

- Every component has a single props interface named `I<Component>` (e.g. `IButton`, `ILoginForm`). See [typescript.instructions.md](typescript.instructions.md) for the naming rules.
- **Extend the underlying MUI props interface** when wrapping MUI, and `Omit` what you replace:

```tsx
// Wrapper repackaging onChange as (value: string) => void
interface ITextField extends Omit<TextFieldProps, "onChange"> {
  onChange: (value: string) => void;
}
```

- Type `children` as `ReactNode`:

```tsx
export default function AuthProvider({
  children,
  permission,
}: {
  children: ReactNode;
  permission: EPermission;
}) { /* ... */ }
```

- Type state setter props as `Dispatch<SetStateAction<T>>` (matches the shape returned by `useState`):

```tsx
interface ILoginForm {
  setIsLoading: Dispatch<SetStateAction<boolean>>;
}
```

- **Callback props are named after the event they handle** — `onClickSubmit`, `onChangeLanguage`, `onBlur`, not `handleX`.
- Provide defaults in destructuring, not inside the body:

```tsx
export default function AddRounded({
  className,
  width = 24,
  height = 24,
  alt = "Add Rounded",
}: IIcon) { /* ... */ }
```

- **Translated strings are passed as strings, never as translation keys.** The parent calls `t()`; the child renders `props.label` as-is.

```tsx
// Bad — child translates
<Button>{t(props.label)}</Button>

// Good — parent translates, child just renders
<Button label={t("login__sign_in")} />
```

---

## Hooks

- Follow the rules of hooks: top level only, no conditionals, no loops.
- Group hooks at the top of the component body — see the file order section below.
- Provide **exhaustive deps** for `useEffect` / `useCallback` / `useMemo`. Do not silence the ESLint rule.

### `useState`

- Type the state explicitly when it isn't trivially inferred.
- Setter names are `set<Variable>`:

```tsx
const [isLoading, setIsLoading] = useState<boolean>(false);
const [formErrors, setFormErrors] = useState<ValidationError[]>([]);
```

- Use the functional updater form when the new value depends on the previous:

```tsx
setLoginForm((prevState) => ({ ...prevState, username: value }));
```

### `useCallback` and `useMemo`

- Wrap handlers with `useCallback` when they are:
  - passed to memoized children, or
  - listed in another hook's dep array.
- `useMemo` for genuinely expensive computations or for stable object identity (e.g. the flat-mapped router config):

```tsx
const routesObj = useMemo(
  () => routes.flatMap(/* ... */),
  [t, localePath],
);
```

- Do not memoize primitives or trivially-cheap objects; you're paying for the memoization without benefit.

### `useEffect`

- **Each effect does one thing.** If you find yourself branching on unrelated conditions, split it into two effects.
- Cleanup subscriptions, timers, and aborts:

```tsx
useEffect(() => {
  const controller = new AbortController();
  fetchData({ signal: controller.signal });
  return () => controller.abort();
}, []);
```

- Prefer event handlers over effects for actions that fire in response to a user event. Effects are for synchronizing with external systems (URL, localStorage, third-party libs, network on mount).
- The container that reads a token then hydrates a store is the canonical "run once we know the auth state" reference — see `routing-and-auth.instructions.md`.

---

## Global state vs local state

- Local UI state → `useState` inside the component.
- Cross-page or cross-component state (current user, feature flags, cart, etc.) → Zustand store under `@stores`. See `state-stores.instructions.md` for shape.
- Reach into the store with the hook, destructuring only what you use so the component re-renders on the right slice:

```tsx
const { user, setUser } = useUserStore();
```

- Do not lift state into a context "just in case" — reach for Zustand instead. Context is fine for values that never change (theme, i18n instance).

---

## Composition patterns used in the repo

### Layout as a namespaced object

Layouts can be exported as a single object with multiple variants:

```tsx
const Layout = { Container, Auth };
export default Layout;

// usage
<Layout.Container>{children}</Layout.Container>
<Layout.Auth>{children}</Layout.Auth>
```

Follow this pattern when a component has multiple mutually-exclusive variants that share styling but not markup.

### Lazy-loaded pages

Pages are `React.lazy`-imported from their `*.route.tsx` file. Do not import a page component directly at module top level.

```tsx
// A route file lazy-imports the page (or its withAuth wrapper)
const homeRoute: IRoute = {
  name: "home__page_title",
  component: lazy(() => import("./withAuthHome")),
  paths: { en: `/${en.locale__key}/${en.routes__home}`, fr: /* ... */ },
};
```

The lazy import must point at the `withAuth<Page>.tsx` wrapper when the page is protected; see the routing instructions for the full pattern.

### Higher-order components

The only HOC in the repo is `withAuth`. When you need to wrap a page with auth:

```tsx
// One-line composition, no JSX or hooks in the wrapper file
const withAuthHome = withAuth(Home, EPermission.HomeRead);
export default withAuthHome;
```

Do not invent new HOCs for concerns that a hook can express — a custom hook is almost always the better tool.

---

## JSX rules

- **Never** use `dangerouslySetInnerHTML`.
- No inline `style={{ ... }}`. Use utility classes → `styled()` → `sx` (in that order). Full rules and when `sx` is allowed live in `styling.instructions.md`.
- `className` composes utility classes from `src/styles` with a BEM class for the component:

```tsx
<div className="admin flex-col gap-xs">...</div>
```

Use `classnames` (already a dep) when composing conditionally:

```tsx
import cx from "classnames";
<div className={cx("card", { "card--selected": isSelected })} />
```

- Add `key` on every list item, and use a **stable id**, never the array index (except for truly static lists).
- Fragments over wrapper `div`s when no styling is needed: `<>...</>`.
- Booleans in conditionals: use `condition && <X />` only when `condition` is a boolean. Convert numbers with `!!count && <X />` to avoid rendering `0`.

---

## Skeletons

A skeleton must occupy the same container as the eventual content so the layout doesn't shift.

```tsx
// Good — same container, just swap the child
<div className="my-container">
  {isFetchingData ? (
    <Skeleton className="my-container__item" animation="wave" />
  ) : (
    <CustomImage className="my-container__item" src="..." />
  )}
</div>

// Bad — different container in each branch
{isFetchingData ? (
  <div className="my-container"><Skeleton ... /></div>
) : (
  <div className="my-container"><CustomImage ... /></div>
)}
```

---

## Forms

Forms live under `@forms/<domain>/<formName>/`. Every form:

1. Controlled `useState` object for the form values.
2. A Yup schema colocated in `<formName>.schema.ts`.
3. Validate on submit with `schema.validateSync(values, { abortEarly: false })` inside a `try`/`catch`.
4. Track a `<name>Validated` boolean so re-validation on `onBlur` only fires after the first submit.
5. Store `ValidationError[]` from `error.inner` and pass it to `FieldHelperText` per field.
6. Show async loading with the `Loading` component driven by a parent-owned `isLoading` state passed as `setIsLoading`.

Full patterns and schema conventions live in `forms.instructions.md`.

---

## File content order

Inside a `.tsx` file, keep this order:

1. Imports (external → aliased → relative → styles).
2. Interfaces / types / enums.
3. Module-level constants.
4. Helper functions.
5. Styled components / private components.
6. The exported component (usually one).

Inside a component body:

1. Hooks (`useTranslation`, `useNavigate`, store hooks, `useState`, `useRef`, custom hooks).
2. Derived variables.
3. Local functions (`useCallback` wrappers).
4. `useEffect` blocks.
5. `return` with JSX.

Sort alphabetically within a group when it does not hurt readability.

---

## Common third-party libraries

Standard tools already installed — reach for these before inventing:

| Concern | Library | Notes |
|---|---|---|
| Routing | `react-router-dom` v6 | `useNavigate`, `useParams`, `<Navigate />`, `createBrowserRouter`. |
| i18n | `react-i18next` | `useTranslation()`. See `i18n.instructions.md` for key rules. |
| HTTP | `axios` via `@services/axiosInstance` | Never import `axios` directly in a component; use a service. |
| Toasts | `react-toastify` | Give each toast a stable `toastId` to prevent duplicates. |
| Head tags | `react-helmet-async` | Already wired at the router level; use for per-page overrides. |
| Analytics | `react-ga4` | Only initialize behind cookie consent (see `App.tsx`). |
| Dates | `dayjs` | Never `new Date()` for formatting. |
| Query strings | `qs` | Already used in `axiosInstance` param serializer. |
| Class composition | `classnames` | Prefer over template strings for conditional classes. |
| Transitions | `react-transition-group` | Used by the `Slide` component. |

Do not add new state / form / data-fetching libraries without discussion — Zustand + native fetch-via-axios + Yup covers the current scope.

---

## Things to avoid

- Class components.
- `React.FC`, `defaultProps`, `PropTypes`.
- `dangerouslySetInnerHTML`.
- Inline styles or `style={{ ... }}` prop (banned; MUI Pigment-CSS `sx` is the escape hatch — see `styling.instructions.md`).
- Context for mutable app state (use Zustand).
- Effects that re-implement event handlers.
- `useEffect` without a dep array unless you truly mean "every render".
- Ignoring the exhaustive-deps ESLint rule.
- Mutating state directly — always return a new object/array from setters.
- Using the array index as a `key` for anything the user can reorder.
- Duplicating translation calls in children — translate once in the parent.
- Business logic in components when it belongs in a service.

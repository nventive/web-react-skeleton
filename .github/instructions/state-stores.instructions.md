---
description: Zustand store conventions — when to promote state to a store, file layout, setter shape, consumption, and hydration/reset patterns.
applyTo: "frontend/src/app/stores/**/*.ts"
---

# State stores (Zustand)

Scope: everything under `@stores/*`. The repo uses **Zustand v4** for cross-component state. Local component state stays in `useState`; only state that must be shared across unrelated subtrees gets a store.

Complementary files (do not repeat their content here):
- [react.instructions.md](react.instructions.md) — `useState` vs "global state" decision (this file expands the "global state" side).
- [typescript.instructions.md](typescript.instructions.md) — `I` prefix, `use*` naming, path aliases.
- [components-vs-containers.instructions.md](components-vs-containers.instructions.md) — which layers may import `@stores/*` (containers, forms, pages — not shared components).
- [routing-and-auth.instructions.md](routing-and-auth.instructions.md) — how `AuthProvider` populates `useUserStore` on boot.
- [services-api.instructions.md](services-api.instructions.md) — service call pattern used when hydrating a store.

Library: `zustand@^4` only. No other state managers (no Redux, MobX, Jotai, Recoil, Context-as-store).

---

## When to create a store

Add a store **only** when both are true:

1. The state is read or written by **two or more sibling subtrees** that don't share a natural parent (or the natural parent is `App`).
2. Passing the state as props would require crossing more than one intermediary that doesn't otherwise use it (i.e., real prop-drilling — not "one hop").

If either is false, keep it as `useState` in the closest common parent. Two counter-examples:

| Symptom | Better home |
| --- | --- |
| Form-level values, validation, submit flag | Local `useState` in the form (see [forms.instructions.md](forms.instructions.md)). |
| Dialog open/close consumed by only one page | Local `useState` on that page. |
| Server data used on one page | Local `useState` + fetch in `useEffect`, or fetch inside the container that owns the page. |
| A value that is genuinely global (current user, theme, feature flags, cart) | Store. |

Rule of thumb: **one store per domain**, not one god-store. Today only one domain qualifies (the current user).

---

## File & folder layout

```
stores/
  <domain>Store.ts        <-- camelCase, one file per domain
```

Rules:
- **Flat folder.** No subfolders per store, no `interfaces/` subfolder. Store, its shape, and its setters all live in one file.
- **File name = `<domain>Store.ts`** (camelCase). The named export is `use<Domain>Store`.
- **No barrel `index.ts`**. Consumers import the store file directly: `import { useUserStore } from "@stores/userStore"`.
- **One `create<...>()` call per file.** Never two stores in the same file.
- **Path alias `@stores`** — never relative imports like `../../stores/userStore`.

---

## Anatomy of a store

```ts
import IUser from "@services/users/interfaces/IUser";
import { create } from "zustand";

interface IUserStore {
  user?: IUser;
  setUser: (user?: IUser) => void;
}

export const useUserStore = create<IUserStore>((set) => ({
  user: undefined,
  setUser: (user) => set({ user }),
}));
```

Rules in order of what they encode:

1. **Import the domain type from its owning service**, not a duplicate. `IUser` lives under `@services/users/interfaces/IUser` because it is a server model (see [services-api.instructions.md](services-api.instructions.md#interfaces)).
2. **Named import `create` from `zustand`** — never `create from "zustand/vanilla"` unless you're writing a non-React store (the repo has no such case).
3. **Interface `I<Name>Store`** inside the file, **not exported**. Consumers rely on the hook's return type, not the interface.
4. **State + setters live on the same interface**, in that order (values first, setters after). Setters are `readonly`-ish by convention — do not add `let` assignments.
5. **Optional values use `?`** with a default of `undefined`. Never `null`.
6. **Setter naming**: `set<Field>` for single-field setters, `reset<Domain>` for reset-to-initial, `<verb><Field>` for action verbs (`toggleSidebar`, `incrementCount`). Match the field name casing exactly (`user` → `setUser`).
7. **Setter signature mirrors the field type** — `setUser: (user?: IUser) => void`. If the field is optional, the setter argument is optional.
8. **Setter implementation via `set({ field })` shorthand** when the update is a straight replacement. Use the functional form `set((state) => ({ field: state.field + 1 }))` only when the new value depends on the previous one.
9. **Named export**, `use<Domain>Store`. Never default-export a store (see [typescript.instructions.md](typescript.instructions.md#exports)).
10. **No initial-state constants defined outside the `create` call** unless reused by a reset action (see [Resetting](#resetting-on-logout-or-context-switch)).

### With an action that depends on previous state

```ts
interface ICartStore {
  items: ICartItem[];
  addItem: (item: ICartItem) => void;
  removeItem: (id: string) => void;
  clear: () => void;
}

const initialItems: ICartItem[] = [];

export const useCartStore = create<ICartStore>((set) => ({
  items: initialItems,
  addItem: (item) => set((state) => ({ items: [...state.items, item] })),
  removeItem: (id) =>
    set((state) => ({ items: state.items.filter((item) => item.id !== id) })),
  clear: () => set({ items: initialItems }),
}));
```

Rules:
- **Functional `set((state) => ...)`** whenever the next state depends on the previous. Never read from the outer hook (`useCartStore.getState()`) inside a component-facing setter — Zustand already gives you `state` in the callback.
- **Return only the fields that change** from the callback. `set` shallow-merges; no need to spread the whole state.
- **Reset via a stable initial constant** so `clear` and the initializer share one source of truth.

---

## Consuming a store

Standard pattern — destructure the fields you need:

```tsx
const { user, setUser } = useUserStore();
```

Rules:
- **Destructure only what you use** — TS strictness (`noUnusedLocals`) will yell if you pull `setUser` without using it.
- **Setters are stable references** (Zustand keeps them across renders). You can safely list them in `useCallback` dep arrays.
- **Do not `useUserStore.getState()`** inside a component. That bypasses React's subscription and won't re-render on change. `getState()` is only for imperative, non-React code (e.g., an Axios interceptor).
- **Do not spread the store**: `const store = useUserStore()` then `store.user`. That subscribes to every field and re-renders on any change.

### Selectors — when to reach for them

The full-destructure pattern above **subscribes to the whole store**. For the current stores (small, few fields), that's fine. Promote to selectors when either is true:

- The store has grown past ~5 fields, and consumers read only one or two.
- A component re-renders too often because an unrelated field mutates.

Selector form:

```tsx
// Read one field, re-render only when it changes
const user = useUserStore((state) => state.user);

// Setters are already stable — pull them the same way
const setUser = useUserStore((state) => state.setUser);
```

Rules:
- **One selector per read.** Do not build an object in the selector (`(state) => ({ a: state.a, b: state.b })`) without `useShallow` from `zustand/react/shallow` — otherwise you re-render every time.
- **Never call hooks inside a selector.** Selectors are plain functions.
- **Do not memoize selectors with `useCallback`.** Zustand handles referential equality itself; a fresh selector closure per render is fine.

---

## Hydration on app boot

Server-backed state (e.g., the current user) is loaded once in a container, not on every consumer:

- **`AuthProvider`** is the single place that populates `useUserStore` — it calls `getMe()` when there's a token but no user, then `setUser(data)`.
- Downstream pages read `user` and assume it's defined. They must sit **inside** a page wrapped with `withAuth` (see [routing-and-auth.instructions.md](routing-and-auth.instructions.md#the-page-recipe)) so the `AuthProvider` gate has already resolved.
- Do not fetch `getMe()` (or any hydration call) from a leaf component "just in case" — duplicate calls cause double-renders and race conditions.

If you add a new store fed by a service, follow the same pattern:

1. Create the store with the field `undefined` by default.
2. Add hydration to the appropriate container (or a new one) inside its `useEffect`.
3. Consumers assume the field is populated by the time they render.

---

## Resetting on logout or context switch

Manual reset today — call the setter with `undefined` / initial:

```ts
// logout handler
localStorage.removeItem(ACCESS_TOKEN);
localStorage.removeItem(REFRESH_TOKEN);
setUser(undefined);
navigate(loginRoute.paths[t("locale__key")]);
```

Rules:
- **Every store touched by an authenticated user must be reset on logout.** Add its reset call to the logout handler.
- **Do not rely on page reload** to clear state. The SPA doesn't reload on logout in this repo — the router just navigates.
- If a store has many fields, expose a `reset<Domain>()` action rather than requiring the caller to unset each field.

---

## Persistence — not used, and when to add it

The repo **does not** use `zustand/middleware`'s `persist` today. Tokens go to `localStorage` directly; user data is re-hydrated via `getMe()` on each page load through `AuthProvider`.

Prefer that pattern for new stores when:
- The data is small and cheap to re-fetch.
- Freshness matters more than boot latency.

Reach for `persist` only when:
- The data is genuinely client-owned (draft form values across reloads, UI prefs, feature-flag overrides).
- Re-fetching would cost too much or is impossible offline.

If you add it, put persisted stores in their own file and be explicit about `partialize` — never persist server-model fields.

---

## Middleware — not used

No `devtools`, `immer`, `subscribeWithSelector`, or `combine` middleware today. Justification: the stores are small and setters read plainly.

If you need `immer` for deeply nested updates, that is a **signal** your store has grown too big — split it into two stores first. If it truly can't be split (e.g., a graph editor), then add `immer`. Keep any middleware addition to the store that needs it — do not blanket-apply.

---

## Accessing store state from non-React code

For code that runs outside React (Axios interceptors, one-shot event listeners, module-level init), use the static API:

```ts
// Axios interceptor — outside a component
import { useUserStore } from "@stores/userStore";

const currentUserId = useUserStore.getState().user?.id;
useUserStore.setState({ user: undefined });
```

Rules:
- **`getState()` reads a snapshot** — it does not subscribe. Use only where you truly can't be in a component.
- **`setState()` merges shallowly** — same behavior as the callback form.
- **Do not use `getState()` in a component** — you'll miss re-renders.

Today no non-React code in the repo does this. Follow the pattern above if the need arises.

---

## Common mistakes and how to fix them

### 1. New `useState` when a store already covers it

```tsx
// Bad — Home.tsx already has `useUserStore`, this shadows it
const [me, setMe] = useState<IUser | undefined>();
useEffect(() => {
  getMe().then(({ data }) => setMe(data));
}, []);
```

```tsx
// Good — the store is the source of truth
const { user } = useUserStore();
```

### 2. Reading with `useUserStore.getState()` inside a component

```tsx
// Bad — no subscription, stale reads
const user = useUserStore.getState().user;
```

```tsx
// Good
const { user } = useUserStore();
// or, if only one field
const user = useUserStore((state) => state.user);
```

### 3. Setter that spreads the whole state

```ts
// Bad — `set` already shallow-merges
setUser: (user) => set((state) => ({ ...state, user })),
```

```ts
// Good
setUser: (user) => set({ user }),
```

### 4. Building an object in a selector without `useShallow`

```tsx
// Bad — re-renders every render
const { user, setUser } = useUserStore((state) => ({
  user: state.user,
  setUser: state.setUser,
}));
```

```tsx
// Good — either full destructure (small store) …
const { user, setUser } = useUserStore();
// … or two selectors (large store)
const user = useUserStore((state) => state.user);
const setUser = useUserStore((state) => state.setUser);
```

### 5. Forgetting to reset a store on logout

Symptom: the next user briefly sees the previous user's name / cart / preferences. Fix: call the store's reset action in `onLogout` alongside token removal.

### 6. Cross-store setters inside `create`

```ts
// Bad — cart store reaches into user store
export const useCartStore = create<ICartStore>((set) => ({
  items: [],
  clearOnLogout: () => {
    useUserStore.setState({ user: undefined }); // don't
    set({ items: [] });
  },
}));
```

Composition belongs in the **caller** (the logout handler), not inside a store. Stores stay independent.

### 7. Interface exported from the store file

```ts
// Bad — encourages typing consumers against IUserStore
export interface IUserStore { /* ... */ }
```

```ts
// Good — interface stays file-local
interface IUserStore { /* ... */ }
```

### 8. Default-exporting the store

```ts
// Bad
export default useUserStore;
```

```ts
// Good — named export; consistent import ergonomics
export const useUserStore = create<IUserStore>(/* ... */);
```

---

## Things to avoid

- Multiple stores in one file.
- Cross-store imports inside `create` (compose in the caller).
- `getState()` / `setState()` inside React components.
- Object-returning selectors without `useShallow`.
- Storing form state, dialog open/close, or single-page counters in a store.
- Persisting server models via `zustand/middleware/persist` (re-hydrate through the owning service instead).
- Adding `immer` to make deep updates easier (split the store instead).
- Introducing Context / Redux / Jotai / Recoil for global state.
- Re-declaring server-model interfaces inside the store file — import them from `@services/*/interfaces/*`.
- Relying on page reload to reset stores on logout — explicit resets only.
- Exporting the `I<Name>Store` interface.
- Default-exporting the hook.

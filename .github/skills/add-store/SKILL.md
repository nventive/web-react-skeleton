---
name: add-store
description: "Add a new Zustand store to the web-react-skeleton React SPA. Use when: creating a new store, adding a Zustand store, promoting state from useState to a store, adding a global slice of state (current user / theme / feature flags / cart), scaffolding a file under frontend/src/app/stores/, or wiring hydration/reset for a store. Enforces the flat folder layout (<domain>Store.ts, one create() per file), the I<Name>Store interface + use<Domain>Store named export, values-first-then-setters shape, shorthand vs functional set(), destructure-only consumption, AuthProvider-owned hydration, and explicit reset-on-logout — no persist/immer/devtools middleware, no cross-store setters, no getState() inside components."
argument-hint: "<domain> — e.g. 'cart' or 'featureFlags'"
---

# Add a Store

Add a new Zustand store under `frontend/src/app/stores/<domain>Store.ts` following the project's flat-file, one-store-per-domain conventions.

## When to Use

- User asks to "add a store", "add a Zustand store", "create a global state slice", or "add a store for X".
- User is about to lift state out of a component because it's read by two or more unrelated subtrees.
- User needs a place to hold hydrated server data that outlives a single page (e.g. current user, feature flags).

Do **not** use this skill for:
- Form values, validation flags, or submit state — those stay in local `useState` inside the form (use `add-form`).
- Dialog open/close consumed by only one page — local `useState`.
- Server data used on exactly one page — fetch in a container / page-level `useEffect`.
- Editing an existing store to add a field — that's a direct edit, not a scaffolding task (but the anatomy rules in this skill still apply).
- Introducing Redux / MobX / Jotai / Recoil / Context-as-store — the repo is Zustand-only. Stop and confirm.

## Inputs to Confirm

Before starting, confirm with the user (ask only what's missing):

1. **Domain** — one word, camelCase, matching the concept the store owns (`user`, `cart`, `featureFlags`). Names the file (`<domain>Store.ts`) and the hook (`use<Domain>Store`). One store per domain, one domain per file.
2. **Why a store (not `useState`)** — confirm the state is shared across two or more sibling subtrees that don't share a natural parent, or would require real prop-drilling. If neither holds, push back and suggest local `useState`.
3. **Fields** — for each: name, TypeScript type, and whether it's optional (`?`, defaults to `undefined`). Reuse server-model interfaces from `@services/<domain>/interfaces/I<Model>` — never redeclare them.
4. **Setters / actions** — one per field by default (`setUser`, `setItems`), plus any action verbs (`addItem`, `removeItem`, `toggleSidebar`). Any action whose next state depends on the previous uses the functional `set((state) => …)` form.
5. **Hydration** — does the store need to be populated from a service on app boot? If yes, which container is responsible (usually `AuthProvider` for auth-gated data; a new container may be needed otherwise). Stores never fetch themselves.
6. **Reset on logout** — every store touched by an authenticated user must be reset in the logout handler. Confirm whether a `reset<Domain>()` action is worth exposing (yes for stores with more than one or two fields).

If the user asked with just a name ("add a cart store"), infer fields from context and confirm assumptions in the summary.

## The Store Pattern (Ground Truth)

Every store looks like this:

```
frontend/src/app/stores/
└── <domain>Store.ts            <-- one file, one create() call
```

Verbatim template:

```ts
import { create } from "zustand";
// import server-model types from their owning service:
// import IUser from "@services/users/interfaces/IUser";

interface I<Domain>Store {
  // values first
  <field>?: <Type>;
  // setters after
  set<Field>: (<field>?: <Type>) => void;
}

export const use<Domain>Store = create<I<Domain>Store>((set) => ({
  <field>: undefined,
  set<Field>: (<field>) => set({ <field> }),
}));
```

Reference implementation in the repo: [frontend/src/app/stores/userStore.ts](../../../frontend/src/app/stores/userStore.ts).

## Procedure

Follow every step in order. Do not skip.

### 1. Verify prerequisites and derive names

- Check whether `frontend/src/app/stores/<domain>Store.ts` already exists. If it does, **stop** — one store per domain. Extend the existing file instead of creating a second one.
- Confirm the "promote to store" gate (from [state-stores.instructions.md](../../instructions/state-stores.instructions.md#when-to-create-a-store)):
  1. Read or written by **two or more sibling subtrees** that don't share a natural parent (or the natural parent is `App`).
  2. Passing as props would cross more than one intermediary that doesn't otherwise use it.

  If either is false, push back — the state belongs in local `useState`.
- Derive names:
  - File: `stores/<domain>Store.ts` (camelCase domain + `Store.ts`).
  - Interface: `I<Domain>Store` (PascalCase), **file-local, not exported**.
  - Hook: `use<Domain>Store` (named export). Never `export default`.
  - Setter names: `set<Field>` matching field casing exactly (`user` → `setUser`, `items` → `setItems`). Action verbs use `<verb><Field>` (`addItem`, `toggleSidebar`, `incrementCount`). Reset uses `reset<Domain>()`.

### 2. Create the store file

Use [assets/domainStore.ts.template](./assets/domainStore.ts.template) as the starting point.

Rules (invariants — from [state-stores.instructions.md](../../instructions/state-stores.instructions.md#anatomy-of-a-store)):

- **Named import `create` from `zustand`** — never `zustand/vanilla`, never a default import.
- **Import server-model types from their owning service** via `@services/*/interfaces/*`. Never redeclare `IUser`, `ICartItem`, etc., inside the store file.
- **Interface `I<Domain>Store`** declared in the file and **not exported**. Consumers rely on the hook's return type.
- **Values first, setters after** on the interface, in declaration order.
- **Optional values use `?` with a default of `undefined`.** Never `null`.
- **Setter signature mirrors the field type.** Optional field → optional setter argument.
- **Setter implementation** — use `set({ field })` shorthand for straight replacement. Use the functional form `set((state) => ({ field: … }))` **only** when the new value depends on the previous one.
- **Return only the fields that change** from the functional callback. `set` shallow-merges; do not spread the whole state.
- **Named export**, `use<Domain>Store` — never `export default`.
- **One `create<…>()` call per file.** Never two stores in the same file.
- **Path alias `@stores`** — never relative imports across folders.

For actions that depend on previous state (add/remove/toggle), pull the initial value out to a stable constant so the reset action and the initializer share one source of truth:

```ts
const initialItems: ICartItem[] = [];

export const useCartStore = create<ICartStore>((set) => ({
  items: initialItems,
  addItem: (item) => set((state) => ({ items: [...state.items, item] })),
  removeItem: (id) =>
    set((state) => ({ items: state.items.filter((item) => item.id !== id) })),
  clear: () => set({ items: initialItems }),
}));
```

### 3. Do not add middleware, persistence, or a barrel

The repo has no `persist`, `immer`, `devtools`, `subscribeWithSelector`, or `combine` middleware, and no `stores/index.ts` barrel. Do not add any of them as part of this task.

- **No `persist`.** For server-backed data, re-hydrate through the owning service (see step 4). Only reach for `persist` for genuinely client-owned data (draft form values across reloads, UI prefs, feature-flag overrides) — and stop and confirm before adding it.
- **No `immer`.** If a setter needs deep updates, the store is too big — split it into two stores first.
- **No `devtools`.** Not used in this repo.
- **No `stores/index.ts`.** Consumers import the file directly: `import { useUserStore } from "@stores/userStore"`.

### 4. Wire hydration in a container (not in the store)

Stores must not fetch themselves. Server-backed state is loaded in a container's `useEffect`:

- **Auth-gated data** (data that requires a logged-in user) → hydrate in [containers/authProvider/AuthProvider.tsx](../../../frontend/src/app/containers/authProvider/AuthProvider.tsx). It already calls `getMe()` when there's a token but no user, then `setUser(data)`. Add your call alongside, following the same pattern.
- **Not auth-gated** → create (or reuse) a container that mounts high enough in the tree (typically inside `App`, above the router outlet) and call your service in its `useEffect`. Consumers assume the field is populated by the time they render — do not fetch "just in case" from a leaf.
- Downstream pages that read auth-gated data must sit **inside** a page wrapped with `withAuth` (see [routing-and-auth.instructions.md](../../instructions/routing-and-auth.instructions.md)) so the gate has already resolved.

If the service the store depends on doesn't exist yet, use the `add-service` skill first.

### 5. Wire reset on logout

Every store touched by an authenticated user must be reset when the user logs out.

- The logout handler lives at the call site (today in [pages/home/Home.tsx](../../../frontend/src/app/pages/home/Home.tsx) alongside `AuthProvider`).
- After removing tokens from `localStorage`, call the setter with `undefined` / initial for each field, or call the store's `reset<Domain>()` action if it exposes one.
- Do **not** rely on a page reload — the SPA doesn't reload on logout in this repo.
- Do **not** compose resets inside the store (`clearOnLogout` reaching into another store). Composition belongs in the caller.

Example:

```ts
// logout handler
localStorage.removeItem(ACCESS_TOKEN);
localStorage.removeItem(REFRESH_TOKEN);
setUser(undefined);
// resetCart();  <-- add resets for every store the user touched
navigate(loginRoute.paths[t("locale__key")]);
```

### 6. Guide consumers (do not implement callers here)

Consumers of the store follow these rules — enforce them wherever you're editing the caller (usually a container, form, or page):

- **Destructure only what you use**: `const { user, setUser } = useUserStore();`. TS strictness will flag unused pulls.
- **Setters are stable references** — safe in `useCallback` dep arrays.
- **Never** `useUserStore.getState()` inside a component — bypasses subscription, causes stale reads. `getState()` is only for imperative non-React code (Axios interceptors, module-level init).
- **Never** spread the store (`const store = useUserStore()`; `store.user`) — that subscribes to every field.
- **Selectors** — the current stores are small; full destructure is fine. Promote to `useStore((state) => state.field)` only when the store has grown past ~5 fields and consumers read only one or two, or when a component re-renders too often. If you build an object in a selector, wrap it in `useShallow` from `zustand/react/shallow`.
- **Which layers may import `@stores/*`**: containers, forms, pages (from [components-vs-containers.instructions.md](../../instructions/components-vs-containers.instructions.md)). Shared components under `@components/*` **must not** import stores — they take props.

### 7. Verify

From `frontend/`:

1. `yarn lint:scripts` — catches unused imports, wrong types, forbidden relative imports.
2. `yarn build` — full type check via `tsc -b`. Confirms the interface + hook wiring is correct end-to-end.
3. Manually exercise the flow: mount, hydrate, mutate, and (if auth-gated) log out to confirm the reset fires.

## Completion Checklist

Before reporting done, verify all apply:

- [ ] File `stores/<domain>Store.ts` exists; no second store file for this domain.
- [ ] `create` is imported from `"zustand"` (named import).
- [ ] Server-model interfaces are imported from `@services/*/interfaces/*`, not redeclared.
- [ ] Interface `I<Domain>Store` is declared in-file and **not exported**.
- [ ] Values come first on the interface, setters after; declaration order matches.
- [ ] Optional values default to `undefined`, never `null`; optional setter args match.
- [ ] Straight-replacement setters use `set({ field })`; previous-state-dependent actions use `set((state) => …)` and return only changed fields.
- [ ] Named export `use<Domain>Store`. No `export default`.
- [ ] Exactly one `create<…>()` call in the file.
- [ ] No `persist`, `immer`, `devtools`, `subscribeWithSelector`, or `combine` middleware.
- [ ] No `stores/index.ts` barrel added.
- [ ] Hydration wired in an appropriate container (`AuthProvider` for auth-gated data); the store itself does not fetch.
- [ ] Reset wired in the logout handler for every field the authenticated user touched.
- [ ] No consumer uses `useStore.getState()` inside a component, spreads the store, or builds an object selector without `useShallow`.
- [ ] Store is not imported from a shared component under `@components/*`.
- [ ] `yarn lint:scripts` passes.
- [ ] `yarn build` passes.

## Anti-patterns to Reject

- Two `create<…>()` calls in the same file, or two files for the same domain.
- Exporting `I<Domain>Store` — encourages typing consumers against the interface instead of the hook return.
- `export default useCartStore` — always a named export.
- Redeclaring a server-model interface inside the store file instead of importing from `@services/*/interfaces/*`.
- `null` as the default for an optional value — always `undefined`.
- Straight-replacement setters written as `set((state) => ({ ...state, field }))` — use `set({ field })`. `set` already shallow-merges.
- Object-returning selectors without `useShallow` — re-renders every render.
- `useStore.getState()` / `useStore.setState()` inside a component — bypasses subscription.
- Store-fetching-itself patterns (calling a service from inside `create`, or from a top-level `useEffect` in a leaf component).
- Cross-store setters inside `create` (one store reaching into another) — compose in the caller.
- Relying on page reload to clear state on logout — explicit resets only.
- Introducing Context / Redux / MobX / Jotai / Recoil for global state.
- Reaching for `immer` because a setter got hairy — split the store instead.
- Adding `persist` for server-backed data — re-hydrate through the owning service.
- Importing `@stores/*` from a shared component under `@components/*`.
- Relative imports (`../../stores/userStore`) instead of `@stores/userStore`.

## References

- [state-stores.instructions.md](../../instructions/state-stores.instructions.md) — the full rules this skill enforces.
- [react.instructions.md](../../instructions/react.instructions.md) — `useState` vs global state decision.
- [typescript.instructions.md](../../instructions/typescript.instructions.md) — `I` prefix, `use*` naming, named exports, path aliases.
- [components-vs-containers.instructions.md](../../instructions/components-vs-containers.instructions.md) — which layers may import `@stores/*`.
- [routing-and-auth.instructions.md](../../instructions/routing-and-auth.instructions.md) — how `AuthProvider` populates `useUserStore` on boot.
- [services-api.instructions.md](../../instructions/services-api.instructions.md) — service call pattern used when hydrating a store.
- [forms.instructions.md](../../instructions/forms.instructions.md) — why form state stays local instead of going into a store.

---
description: TypeScript conventions for the frontend (naming, typing, imports, strictness).
applyTo: "frontend/src/**/*.{ts,tsx}"
---

# TypeScript conventions

Scope: everything under `frontend/src`. This file is about TypeScript itself; every other instruction file layers domain rules on top of what's here.

Complementary files (do not repeat their content here):
- [react.instructions.md](react.instructions.md) — component shape, hooks, JSX rules.
- [components-vs-containers.instructions.md](components-vs-containers.instructions.md) — folder decision + import allowlist.
- [services-api.instructions.md](services-api.instructions.md) — where domain-model interfaces (`I<Model>`) live.
- [state-stores.instructions.md](state-stores.instructions.md) — the `I<Name>Store` file-local interface convention.
- [forms.instructions.md](forms.instructions.md) — inline `I<FormName>` props next to the form component.

The project uses TypeScript in **strict** mode with `noUnusedLocals`, `noUnusedParameters`, and `noFallthroughCasesInSwitch` enabled (see [frontend/tsconfig.app.json](frontend/tsconfig.app.json)). Do not weaken these settings and do not add `// @ts-ignore` or `// @ts-expect-error` unless a comment explains why and links a follow-up.

---

## Naming conventions

| Symbol | Convention | Example |
|---|---|---|
| Interface | `I` prefix, PascalCase | `IUser`, `IButton`, `IIcon` |
| Enum | `E` prefix, PascalCase, use `const enum` | `EPermission` |
| Type alias | PascalCase, no prefix | `Status`, `UserResponse` |
| Variables / functions | camelCase | `getUser`, `hasModification` |
| React components | PascalCase, `function` keyword | `function Button(...)` |
| Files | Match the default export name exactly | `Button.tsx`, `useUserStore.ts`, `IUser.ts` |

Rules:
- **The file name must match the default export.** A component `AccessCard` lives in `AccessCard.tsx`; a hook `useCustomerInfo` lives in `useCustomerInfo.ts`.
- Use `.tsx` **only** when the file uses JSX. Pure TS (interfaces, stores, services, utils, enums) must be `.ts`.
- State setter names follow `set<Variable>`: `const [hasModification, setHasModification] = useState<boolean>(false);`.
- Callback prop handlers are named after the event they handle: `onClickSubmit`, `onChangeName`, not `handleSubmit`.

---

## `interface` vs `type`

Default to `interface`. Reach for `type` only when the shape can't be expressed as an interface.

### Use `interface` for object shapes and extension

```ts
interface IUser {
  id: number;
  name: string;
  email: string;
}

interface IAdmin extends IUser {
  canDeleteUsers: boolean;
}
```

Extend third-party types the same way:

```tsx
interface IButton extends ButtonProps {
  target?: string;
}
```

### Use `type` for unions, intersections, primitives, generics, mapped types

```ts
type ID = number | string;
type Status = "success" | "info" | "warning" | "error";
type UserResponse = IUser | null;
type Dictionary<T> = { [key: string]: T };
```

A string-union `type` is preferred over an `enum` when the values only need to travel through the type system (e.g. API response discriminants) — inference and autocompletion are simpler.

### Never mix

Do not declare the same concept as both an `interface` and a `type` (`IUser` interface + `UserType` alias). Pick one and export it.

---

## Enums

Use `const enum` with an `E` prefix and `default export`:

```ts
const enum EPermission {
  HomeRead = "HomeRead",
  DashboardRead = "DashboardRead",
  UikitRead = "UikitRead",
}

export default EPermission;
```

- Values are string literals matching the key. Don't rely on numeric enum values.
- Prefer a string-union `type` when the set of values only crosses TypeScript boundaries (see previous section). Use an enum when the values need a stable runtime identity (permission names sent to the API, route keys, etc.).

---

## Avoid `any` and `unknown`

- **Never** use `any`. If you truly don't know the shape, type it precisely at the boundary (API response, third-party lib) and refine from there.
- `unknown` is acceptable only at trust boundaries (e.g. `JSON.parse`, `catch (err: unknown)`), and must be narrowed before use.
- Do not use `Function` or `object` as types. Prefer a specific signature or `Record<string, unknown>`.

```ts
// Bad
function log(data: any) { console.log(data); }

// Good
function log<T>(data: T): void { console.log(data); }

// Acceptable at a boundary
try {
  await save();
} catch (err: unknown) {
  if (err instanceof Error) toast.error(err.message);
}
```

---

## Functions

- Non-component functions are arrow functions: `const getUser = (id: number): Promise<IUser> => { ... }`.
- React components use the `function` keyword (lexical `this` doesn't matter for components and stack traces read better).
- **Prefer a `const` variable over a function when there's no computation with parameters.**

```ts
// Bad
const showButton = (): boolean => {
  return providerId === client.providerId;
};

// Good
const showButton = providerId === client.providerId;
```

- Type the return type explicitly on exported functions and on any non-trivial function. Inference is fine for short local helpers.
- Prefer readonly parameters (`readonly IUser[]`) when the function must not mutate its input.

---

## Generics

Use generics when a function or type must preserve a caller's type. Constrain them.

```ts
// Zustand store creation
export const useUserStore = create<IUserStore>((set) => ({
  user: undefined,
  setUser: (user) => set({ user }),
}));

// Constrained generic
function pickId<T extends { id: string | number }>(items: T[]): T["id"][] {
  return items.map((i) => i.id);
}
```

Do not add generics that only appear once in the signature — that's just `any` in disguise.

---

## Imports and path aliases

The project defines path aliases in [frontend/tsconfig.app.json](frontend/tsconfig.app.json). **Always use them** when crossing an `app/` subfolder. Reserve relative imports for files within the same feature folder.

| Alias | Points to |
|---|---|
| `@assets/*` | `src/assets/*` |
| `@components/*` | `src/app/components/*` |
| `@containers/*` | `src/app/containers/*` |
| `@enums/*` | `src/app/enums/*` |
| `@forms/*` | `src/app/forms/*` |
| `@hocs/*` | `src/app/hocs/*` |
| `@icons/*` | `src/app/icons/*` |
| `@pages/*` | `src/app/pages/*` |
| `@routes/*` | `src/app/routes/*` |
| `@services/*` | `src/app/services/*` |
| `@shared/*` | `src/app/shared/*` |
| `@stores/*` | `src/app/stores/*` |
| `@styles/*` | `src/styles/*` |

```ts
// Bad
import IUser from "../../../services/users/interfaces/IUser";
import EPermission from "../../enums/EPermission";

// Good
import IUser from "@services/users/interfaces/IUser";
import EPermission from "@enums/EPermission";

// Relative import — OK, same feature folder
import "./button.scss";
```

Order imports as: external packages → aliased internal → relative → styles. ESLint / Prettier handle formatting; do not fight the tooling.

---

## Nullability and optional properties

- Mark optional properties with `?` on the interface. Do not use `| undefined` for object properties.
- Prefer `undefined` over `null` for "no value" unless an external API forces `null`. Do not mix both for the same field.
- Provide defaults in destructuring rather than checking inside the function body:

```tsx
// Icon component defaults — destructured, not assigned in the body
export default function AddRounded({
  className,
  width = 24,
  height = 24,
  alt = "Add Rounded",
}: IIcon) { /* ... */ }
```

- Use optional chaining (`user?.email`) and nullish coalescing (`name ?? "Anonymous"`) instead of `&&` chains or `||` (which mishandles `""`, `0`, `false`).

---

## File content order

Keep files predictable. Within a `.ts` / `.tsx` file:

1. Imports
2. Interfaces, types, enums
3. Constants / module-level variables
4. Helper functions
5. Styled components / private components
6. The public (usually only) exported component or function

Within a React component body: hooks → variables → functions → effects → return. Sort alphabetically within a group when it doesn't hurt readability.

---

## Vite / ambient types

- Vite-injected constants (e.g. `__API_URL__` used in `@services/axiosInstance`) are declared in [frontend/src/vite-env.d.ts](frontend/src/vite-env.d.ts). Add new ones there, don't re-declare inline.
- Environment variables use `import.meta.env.VITE_*`. Type them via `ImportMetaEnv` augmentation in `vite-env.d.ts`.
- Global CSS / asset modules already have declarations; don't add `declare module "*.scss"` locally.

---

## Interfaces live next to what they describe

For domain models, colocate the interface under the owning service, following the existing layout:

```
src/app/services/users/
  interfaces/
    IUser.ts        <-- default export, one interface per file
  usersService.ts
```

Component-local prop interfaces stay in the component file:

```tsx
interface IButton extends ButtonProps {
  target?: string;
}

export default function Button({ children, ...props }: IButton) { /* ... */ }
```

Rule of thumb: one exported interface per file when it's a shared domain type; inline when it's only used by that component.

---

## Things to avoid

- `any`, `Function`, `object`, `{}` as a type.
- Non-null assertions (`value!`) — narrow the type instead.
- `as` casts, except when narrowing after a runtime check or bridging a third-party type. Never `as unknown as T`.
- Type-only side effects (`import "some/type";` used just to trigger declaration merging) — use `import type` explicitly.
- Re-exporting via `export * from` in barrels — imports go through path aliases directly to the source file.

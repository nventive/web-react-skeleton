---
applyTo: "frontend/**"
---

# Frontend conventions

These rules apply to every file under `frontend/**`. Read them before editing any frontend file; follow them in any code you write or change.

Sections tagged **(stack-specific)** apply only when the matching library is in use — skip them otherwise.

---

## 1. Code formatting

- Prettier formats all TypeScript, JavaScript, JSON, CSS/SCSS and Markdown.
- Format on save in the editor — never let formatting changes leak into feature PRs.
- EditorConfig: 2-space indent, LF line endings, UTF-8, trim trailing whitespace, final newline.

## 2. Designs

- Follow UI designs as closely as possible. If a design is impractical or costly to match,
  the designer and developer must align on alternatives before implementation.
- Use the design tool's inspector (Figma, etc.) to pull exact colors, spacing and typography.

## 3. TypeScript

- Avoid `any` and `unknown`.
- Prefer `interface` for object shapes; extend with `extends`.
- Use `type` for unions, intersections, generics and string-literal "enums":
  ```ts
  type Status = "success" | "info" | "warning" | "error";
  ```
- Strict mode is mandatory (`strict`, `noUnusedLocals`, `noUnusedParameters`,
  `noFallthroughCasesInSwitch`).
- Use path aliases (e.g. `@components`, `@services`) instead of long relative imports.

## 4. Functions

- Only use a function when one is actually needed. A derived boolean is a `const`, not a function:
  ```ts
  // good
  const showButton = providerId === client.providerId;

  // unnecessary
  const showButton = (): boolean => providerId === client.providerId;
  ```
- Callbacks are named after the event they handle: `onClick…`, `onChange…`, `onSubmit…`.
- Non-component functions are `camelCase`.
- Use arrow functions for utilities; use regular `function` declarations for React components.

## 5. React components

- Functional components only.
- Component file naming matches the default export: `AccessCard.tsx`, `useCustomerInfo.ts`.
- Use `.tsx` only when JSX is present; otherwise `.ts`.
- Never use `dangerouslySetInnerHTML`.
- Business logic belongs on the server when possible, not in the client.

### Components vs containers

- **Component** — manages how things look. No dependencies on the rest of the app.
  Receives data and callbacks via props. Rarely stateful; when it is, only for UI state
  (open/closed, hover, etc.). Examples: `Button`, `Table`, `Spinner`.
- **Container** — manages how things work. Often stateful, serves as data source.
  May compose presentational and other container components. Has no styles of its own
  beyond layout wrappers. Examples: `UserInfo`, `ShoppingCart`.

This split is a guideline, not a dogma. If the boundary is unclear, defer the decision.

## 6. State

- `useState` setters are always named `set<VariableName>`:
  ```ts
  const [hasModification, setHasModification] = useState<boolean>(false);
  ```
- Global state lives in a dedicated store (Zustand or equivalent), not in context that
  re-renders large trees.

## 7. Internationalization

- Translate in the parent, pass already-translated strings down as props:
  ```tsx
  // good
  <Button>{props.label}</Button>

  // wrong
  <Button>{t(props.label)}</Button>
  ```
- Use the i18n library's interpolation, not `String.replace`:
  ```ts
  t("plan_coMemberFee_label", {
    coMemberFee: formatCurrency(amount),
    coMemberFeeType: feeTypeLabel,
  });
  ```
- Use the i18n library's plural support; never branch on `count` in the component:
  ```ts
  t("asset__share_modal_title", { count: assets.length });
  ```
  ```json
  {
    "asset__share_modal_title": "Share asset",
    "asset__share_modal_title_other": "Share assets"
  }
  ```

## 8. Styling

- Default approach: one `.scss` file per component, colocated with the `.tsx`.
- Class naming follows [BEM](https://getbem.com/naming/).
- Provide a small set of utility classes for spacing and layout (gap, padding, margin,
  flex direction) generated from the theme tokens.
- All colors come from the theme palette. No hex or named colors in component styles
  (enforced by Stylelint).
- All shared font styles come from the theme typography.
- Media queries sit below the sibling rules at the same level, separated by a blank line.
- Avoid inline styles.
- Avoid `!important`. If unavoidable, leave a one-line comment explaining why.
- Avoid selectors that reach into a third-party component's internals — they break on upgrades.
- Style class names are `camelCase` starting lowercase: `listItem`, not `list-item` or `ListItem`.

**(stack-specific — MUI)** When wrapping an MUI component for reuse across the app,
create a styled wrapper inside `components/` rather than mutating the theme. Reserve theme
changes for cross-cutting concerns. Do not use the `sx` prop — prefer a `div` plus
utility/component classes.

## 9. Skeletons / loading states

Skeletons match the structure of the content they replace. Toggle inside the same
container, not around it:

```tsx
// good
<div className="myContainer">
  {isLoading ? (
    <Skeleton className="myContainer__item" />
  ) : (
    <Image className="myContainer__item" src={src} />
  )}
</div>

// wrong
{isLoading ? (
  <div className="myContainer"><Skeleton className="myContainer__item" /></div>
) : (
  <div className="myContainer"><Image className="myContainer__item" src={src} /></div>
)}
```

## 10. Responsiveness

- Test at multiple breakpoints during development.
- Prefer CSS media queries to JavaScript-based viewport hooks. Reach for `useMediaQuery`
  only when expressing the same rule in CSS would be significantly more work.

## 11. File contents order

Within a React component file:
1. Imports
2. Interfaces, types, enums
3. Module-level variables
4. Helper functions
5. Styles (when colocated)
6. Private (file-local) components
7. The public exported component (usually only one)

Within a component body:
1. Hooks
2. Variables
3. Functions
4. Effects
5. Return

Sort alphabetically within each group when there is no other natural order.

## 12. Recommended folder layout

```
frontend/src/
  app/
    components/      # presentational
    containers/      # stateful / data sources
    hocs/            # higher-order components
    forms/           # form definitions and validation schemas
    pages/           # route-level components
    routes/          # route configuration
    services/        # API clients, interceptors
    stores/          # global state
    hooks/           # shared hooks
    icons/           # SVG components
    enums/
    shared/          # constants, i18n setup, helpers
  assets/
    fonts/
    images/
    locales/
  styles/            # globals, variables, mixins, utility classes
  themes/            # palette, typography, spacing/layout tokens
```

## 13. Anti-patterns (do not do this)

- `any`, `unknown`, or `as any` casts.
- `dangerouslySetInnerHTML`.
- Inline `style={…}` on components.
- `!important` without a comment.
- Class components.
- Translating the same key in both parent and child.
- Branching on `count` in components instead of using plural keys.
- Reaching into a UI library's internal class selectors.

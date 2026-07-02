---
description: MUI (Material UI v6 + Pigment-CSS) wrapping conventions and how to register components in the UiKit page.
applyTo: "frontend/src/app/components/**/*.tsx,frontend/src/app/pages/uikit/**/*.tsx,frontend/src/themes/**/*.ts,frontend/vite.config.ts"
---

# MUI & UiKit

Scope: how to wrap MUI primitives into repo-consistent components, how the Pigment-CSS integration works, and how new components get registered on the UiKit page.

Complementary files (do not repeat their content here):
- [styling.instructions.md](styling.instructions.md) — utility classes, theme tokens, `styled()` / `sx` rules, CSS Modules.
- [react.instructions.md](react.instructions.md) — component shape (`function` keyword, default export, props interface).
- [typescript.instructions.md](typescript.instructions.md) — naming (`I` prefix, aliases).
- [components-vs-containers.instructions.md](components-vs-containers.instructions.md) — where wrappers live.

---

## Stack summary

| Concern | Package | Notes |
|---|---|---|
| Component library | `@mui/material` v6 | Standard MUI primitives. |
| Styling engine | `@mui/material-pigment-css` + `@pigment-css/vite-plugin` | Compile-time CSS extraction. `styled()`, `css()`, and `sx` come from here, **not** from `@mui/material/styles`. |
| Icons library | `@mui/icons-material` | Available but the repo prefers custom SVG icons under `@icons` (see `icons.instructions.md`). |
| Theme | `frontend/src/themes/theme.ts` | Built with `cssVariables: true`, extended via [frontend/src/material-ui-pigment-css.d.ts](frontend/src/material-ui-pigment-css.d.ts). |
| Pigment-CSS wiring | [frontend/vite.config.ts](frontend/vite.config.ts) | `pigment({ theme, transformLibraries: ["@mui/material"] })`. Adding another MUI-family lib means extending `transformLibraries`. |

The Pigment integration is the reason `sx` is cheap in this project (compiled to static CSS). Do not "upgrade" to `@emotion/react` or `@mui/styles` — that would break the build.

---

## Wrap MUI primitives; don't use them raw

Every MUI primitive used in the app is wrapped in a repo component under `@components/<name>/<Name>.tsx`. New code imports the wrapper, not the MUI original.

```tsx
// Bad — MUI primitive imported directly in a page/container
import { Button } from "@mui/material";

// Good — repo wrapper
import Button from "@components/button/Button";
```

The **only** MUI primitives imported directly are the ones without a wrapper today:
- `<Typography>` (`@mui/material/Typography`) — style is fully covered by variants.
- `<Grid>` / `<Grid2>` (`@mui/material/Grid2`) — layout primitive.

Anything else new needs a wrapper before use. If you find yourself importing from `@mui/material` in a page or form, stop and create the wrapper first.

### Why wrap?

- Single place to enforce a repo-wide default (border-radius, transition, icon slot).
- Insulates against MUI upgrades that change internal class names or slots.
- Keeps API surface small and typed to the repo's needs (e.g. `TextField.onChange` returning `value: string`).

---

## The wrapper pattern

Every wrapper follows the same shape. Study the canonical example and copy it.

```tsx
// Canonical wrapper pattern — wraps a MUI primitive with a styled() default
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

Checklist for a new wrapper:

1. **Import both the primitive and its props type** aliased: `import { XProps, X as MuiX } from "@mui/material";`.
2. **Import `styled` from `@mui/material-pigment-css`** — not from `@mui/material/styles`.
3. **Name the styled node `StyledMuiX`** and declare it above the exported component.
4. **Props interface `IX extends XProps`**. Use `Omit<XProps, "field">` when you replace an existing prop (see `ITextField` renaming `onChange`).
5. **Default export**, `function` keyword, file name matches (`X.tsx`).
6. **Style through `theme.customProperties.*` / `theme.palette.*` / `theme.breakpoints.up(...)`** — never hardcoded values. See `styling.instructions.md`.
7. **No new business logic** in the wrapper. It's a styling + defaults layer.
8. **Set sensible defaults via destructuring**, not `defaultProps`.
9. **Register it in the UiKit page** (see below).

### Patterns

**Passing through when only defaults are needed** — do it via destructuring, then spread:

```tsx
// Wrapping with fixed defaults
export default function Accordion({ children, ...props }: AccordionProps) {
  return (
    <StyledMuiAccordion {...props} disableGutters elevation={0} square>
      {children}
    </StyledMuiAccordion>
  );
}
```

**Replacing a prop's signature** — `Omit` the original, redeclare:

```tsx
// Repackaging onChange as (value: string) => void
interface ITextField extends Omit<TextFieldProps, "onChange"> {
  onChange: (value: string) => void;
}
```

**Providing a default JSX slot** — destructure with a default expression:

```tsx
// Default icon slot for an accordion summary
export default function AccordionSummary({
  children,
  expandIcon = <CaretIcon width={16} height={16} />,
  ...props
}: AccordionSummaryProps) { /* ... */ }
```

**Forwarding a ref** — only when the wrapper genuinely needs to pass a DOM ref through (e.g. a `<Slide>` used as a transition component):

```tsx
// Only add forwardRef when a parent (MUI dialog, transition group, popper) needs the ref
const Slide = forwardRef(function Slide(
  { direction = "up", timeout = 500, ...props }: SlideProps,
  ref: Ref<unknown>,
) {
  return <MuiSlide ref={ref} direction={direction} timeout={timeout} {...props} />;
});
export default Slide;
```

`forwardRef` is used **only** when a parent (MUI dialog, transition group, popper, …) needs the ref. Do not add it prophylactically.

---

## Targeting MUI internals — last resort

When wrapping, prefer changing behaviour through **props and named slots**. Reach for `& .MuiX-y` internal-class selectors only when there's no slot for what you need. These selectors break silently across MUI major versions.

```tsx
// Acceptable — accessing named parts through the documented slot classes
const StyledMuiAccordionSummary = styled(MuiAccordionSummary)(({ theme }) => ({
  flexDirection: "row-reverse",
  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
    transform: "rotate(90deg)",
  },
  "& .MuiAccordionSummary-content": {
    marginLeft: theme.spacing(1),
    alignItems: "center",
  },
}));

// Preferred if a prop / slot exists — e.g. `disableGutters`, `elevation`, `square`
<StyledMuiAccordion {...props} disableGutters elevation={0} square />
```

If you must target internals, add a one-line comment noting **why** (no prop covers it) so a future reader knows why the fragile selector exists.

---

## `css()` alongside `styled()`

Use `css()` from `@mui/material-pigment-css` when you need a **class token** rather than a wrapped component — typically for `react-transition-group` `classNames` slots. Same theme access, same compile-time extraction.

```tsx
// Class-token pattern for transition slots
import { css } from "@mui/material-pigment-css";

const enterActive = css(({ theme }) => ({
  opacity: 1,
  transition: `opacity ${theme.transitions.duration.standard}ms ${theme.transitions.easing.easeIn}`,
}));

<CSSTransition classNames={{ enter: classes["enter"], enterActive, /* ... */ }} />
```

Do not build class strings by hand for transition libraries — use `css()`.

---

## Theme extension (custom slots on `Theme`)

When you introduce a new custom token (a `zIndex` layer, a new `customProperties` bucket, a palette shade beyond MUI defaults), extend the theme types in one place:

- Add the value in [frontend/src/themes/variables.ts](frontend/src/themes/variables.ts) or `palette.ts`.
- Augment the type in [frontend/src/material-ui-pigment-css.d.ts](frontend/src/material-ui-pigment-css.d.ts) — this file already augments `Theme`, `ThemeOptions`, `ZIndex`, `CustomSpacing`, `CustomBorderRadius`. Mirror the existing pattern:

```ts
declare module "@mui/material/styles" {
  interface CustomSpacing {
    /* add new keys here */
  }
  interface Theme {
    /* add new top-level custom buckets here */
  }
  interface ThemeOptions {
    /* mirror as Partial<> */
  }
}
```

Full token/theme rules live in [styling.instructions.md](styling.instructions.md#theme-is-the-single-source-of-truth).

---

## Register new components in the UiKit page

The UiKit page is a live style guide. **Every new wrapper under `@components/*` gets an entry in the UiKit page (`@pages/uikit`).**

Anatomy of an entry:

```tsx
<UikitBlock
  id="fieldhelpertext"                          // slug — used for nav anchor
  title="FieldHelperText.tsx"                   // shown as the block heading
  codeBlock={`<TextField label="Username" />
<FieldHelperText
  fieldNames="username"
  helperText="Name must be minimum 1 character"
/>`}                                            // optional — shows a copyable code snippet
>
  <TextField label={t("login__username")} />
  <FieldHelperText
    fieldNames="username"
    helperText="Name must be minimum 1 character"
  />
</UikitBlock>
```

Rules:
- **`id`** is a stable slug (lowercase, no spaces). The `UikitNav` in the page scans `.uikit-block` DOM nodes on mount and builds the side nav from their first child's text — the title.
- **`title`** matches the component file name (e.g. `Button.tsx`, `FieldHelperText.tsx`) so a reader can grep from the guide to the source.
- **`codeBlock`** is a template literal showing the smallest useful usage. Omit only when the component isn't reasonably code-demonstrable (e.g. a layout container).
- Show meaningful variants (empty / with data / error / disabled) inside a single `UikitBlock` or across siblings, matching what's already there for `FieldHelperText`.
- The helper primitives (`UikitBlock`, `UikitColor`, `UikitNav`) live under `@components/uikit/*` — do not add new UiKit helpers under `@components/` roots; keep them namespaced under `@components/uikit/`.

If you skip UiKit registration, the design system silently drifts — flag it as a missing step in reviews.

---

## Icons

- Do not import `@mui/icons-material` in new code without a wrapper — the repo prefers custom SVG icons under `@icons/*` implementing the `IIcon` contract.
- Full icon rules live in `icons.instructions.md`.

---

## Things to avoid

- Importing directly from `@mui/material` outside `@components/*` (with the whitelisted exceptions: `Typography`, `Grid`/`Grid2`).
- Importing `styled` / `css` from `@mui/material/styles` or `@emotion/styled` — always from `@mui/material-pigment-css`.
- Recreating a wrapper that already exists (grep `@components/*` before you write a new one).
- Adding runtime CSS-in-JS libraries (`emotion`, `styled-components`, `stitches`) — Pigment-CSS is the only styling runtime.
- Overriding MUI theme behaviour globally in `theme.ts` to fix a one-off — express it in the component wrapper instead (when the app grows, global overrides tend to cause hard-to-diagnose bugs).
- Putting business logic (data fetching, navigation, store access) inside a wrapper — wrappers are presentational (see [components-vs-containers.instructions.md](components-vs-containers.instructions.md)).
- Shipping a new component without a UiKit entry.
- `defaultProps` — use destructuring defaults.
- Extending `theme` types anywhere other than `material-ui-pigment-css.d.ts`.

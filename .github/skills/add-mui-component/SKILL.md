---
name: add-mui-component
description: "Wrap a Material UI v6 primitive as a repo component in the web-react-skeleton React SPA. Use when: adding a new MUI wrapper, creating a new file under frontend/src/app/components/, wrapping Button/TextField/Dialog/Chip/Autocomplete/Menu/etc., registering a component in the UiKit page, styling an MUI primitive with Pigment-CSS styled(), or replacing a raw `@mui/material` import with a wrapper. Enforces the folder layout (components/<name>/<Name>.tsx), the styled()-from-pigment-css wrapping pattern, IX-extends-XProps typing, destructured defaults (no defaultProps), theme-token-only styling, and the mandatory UiKit page registration."
argument-hint: "<MuiPrimitive> — e.g. 'Chip', 'Autocomplete', 'Menu'"
---

# Add an MUI Component Wrapper

Wrap a `@mui/material` primitive as a repo component under `frontend/src/app/components/<name>/<Name>.tsx` following the project's Pigment-CSS `styled()` conventions, and register it in the UiKit page.

## When to Use

- User asks to "wrap an MUI component", "add a Chip component", "add an Autocomplete", "add a Menu", etc.
- User writes `import { X } from "@mui/material"` in a page/form/container and X has no wrapper under `@components/*` yet.
- User needs to apply a repo-wide default (border-radius, elevation, transition) to an MUI primitive.
- User is adding to the UiKit page and the underlying component doesn't exist yet.

Do **not** use this skill for:
- `Typography` or `Grid` / `Grid2` — these are the two whitelisted exceptions imported directly from `@mui/material`.
- Icons — SVG icons under `@icons/*` follow the `IIcon` contract, not this pattern. See `icons.instructions.md`.
- A composite piece of UI that owns state, data fetching, or navigation — that's a container. See `components-vs-containers.instructions.md`.
- Editing an existing wrapper (just edit it in place following the same rules).
- Restyling globally via `theme.ts` — express the default in the wrapper instead.

## Inputs to Confirm

Before starting, confirm with the user (ask only what's missing):

1. **MUI primitive** — the exact export name from `@mui/material` (e.g. `Chip`, `Autocomplete`, `Menu`, `Tooltip`). If MUI ships it split across sub-modules (e.g. `Autocomplete` uses `AutocompleteProps<T, Multiple, DisableClearable, FreeSolo>`), note the generic parameters.
2. **Repo-wide defaults** — what should be baked in (border-radius from `theme.customProperties.borderRadius.*`, elevation, variant, color, disableRipple, etc.). If none, the wrapper is a passthrough with a `styled()` for future-proofing.
3. **Prop signature changes** — any `Omit<XProps, "…">` + redeclaration (like `TextField.onChange` returning `value: string`). Default is no changes.
4. **Default JSX slots** — any `expandIcon={<CaretIcon />}`-style default children passed via destructuring.
5. **Ref forwarding** — only if a parent (dialog, transition group, popper) needs it. Default is no.
6. **UiKit demo variants** — the smallest useful demo(s): empty / with data / disabled / error / colored variants. At minimum one.

If the user just says "add a Chip wrapper", infer sensible defaults from the closest existing wrapper (`Button` for basic passthrough, `TextField` for `Omit`-based prop rewrites) and confirm in the summary.

## The Wrapper Pattern (Ground Truth)

Every wrapper is exactly one file:

```
frontend/src/app/components/<name>/
└── <Name>.tsx          # default export, PascalCase file name matches component
```

- Folder name is lowerCamelCase of the component name (`button/`, `textField/`, `iconButton/`, `accordionSummary/`).
- File name is the PascalCase component + `.tsx` (`Button.tsx`, `TextField.tsx`).
- No `interfaces/` folder, no `types.ts`, no colocated helpers. The props interface is inline.
- No `index.ts` barrel — consumers import the file directly: `import Button from "@components/button/Button"`.

Canonical shape (from [components/button/Button.tsx](../../../frontend/src/app/components/button/Button.tsx)):

```tsx
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

## Procedure

Follow every step in order. Do not skip.

### 1. Verify the wrapper doesn't already exist

- List `frontend/src/app/components/` and confirm no folder matches (case-insensitively).
- Grep for `import { <Primitive> as Mui<Primitive> } from "@mui/material"` — if it appears anywhere outside `@components/`, that call site should switch to the wrapper you're about to create.
- If a wrapper already exists, stop and edit it in place — do not create a second wrapper.

### 2. Create the folder + file

Create `frontend/src/app/components/<name>/<Name>.tsx` from [assets/Component.tsx.template](./assets/Component.tsx.template). Replace `__Name__` (PascalCase, e.g. `Chip`) and `__name__` (lowerCamelCase, e.g. `chip`) throughout.

Invariants (from [mui-and-uikit.instructions.md](../../instructions/mui-and-uikit.instructions.md)):

- **Import the primitive and its props type together**, aliased: `import { XProps, X as MuiX } from "@mui/material"`. Both from the top-level `@mui/material` — never from a deep path like `@mui/material/Chip` unless the top-level barrel doesn't re-export it.
- **Import `styled` from `@mui/material-pigment-css`** — never from `@mui/material/styles`, never from `@emotion/styled`, never from `styled-components`. Pigment-CSS is the only styling runtime.
- **Declare `StyledMuiX`** above the exported component using the callback signature: `styled(MuiX)(({ theme }) => ({ … }))`. Even a passthrough uses `styled()` so future overrides don't require a rewrite.
- **Props interface `IX extends XProps`** — `I` prefix, PascalCase. Inline in the same file. Never `type`, never `export interface`.
- **When replacing a prop**, use `Omit<XProps, "field">` then redeclare with the new signature. Example: `interface ITextField extends Omit<TextFieldProps, "onChange"> { onChange: (value: string) => void; }`.
- **Default export**, `function` keyword: `export default function X({ … }: IX) { … }`. Never arrow, never named export, never `default` an anonymous function.
- **Destructure with defaults** for fixed values (`disableGutters`, `elevation={0}`, `variant="outlined"`) and for default JSX slots (`expandIcon = <CaretIcon width={16} height={16} />`). **No `defaultProps`** — it's deprecated in React 18+.
- **Spread `{...props}` first**, then override the props the wrapper controls, so consumer props can't accidentally undo the wrapper's contract:
  ```tsx
  <StyledMuiX {...props} disableGutters elevation={0} square />
  ```
- **File and folder name match the component** exactly.

### 3. Apply the correct pattern variant

Pick the one that matches the requirement and follow the rules under it. Most wrappers are variant A.

**A. Passthrough with baked-in defaults** — most common. See [Button.tsx](../../../frontend/src/app/components/button/Button.tsx) and [Accordion.tsx](../../../frontend/src/app/components/accordion/Accordion.tsx).

```tsx
export default function Accordion({ children, ...props }: AccordionProps) {
  return (
    <StyledMuiAccordion {...props} disableGutters elevation={0} square>
      {children}
    </StyledMuiAccordion>
  );
}
```

**B. Rewriting a prop signature** — use `Omit` + redeclare, then adapt inside. See [TextField.tsx](../../../frontend/src/app/components/textField/TextField.tsx).

```tsx
interface ITextField extends Omit<TextFieldProps, "onChange"> {
  onChange: (value: string) => void;
}

export default function TextField({ onChange, value, ...props }: ITextField) {
  return (
    <StyledMuiTextField
      {...props}
      value={value === undefined ? "" : value}
      variant="outlined"
      onChange={(event: ChangeEvent<HTMLInputElement>) => onChange(event.target.value)}
    />
  );
}
```

**C. Default JSX slot** — destructure with a default expression. See [AccordionSummary.tsx](../../../frontend/src/app/components/accordionSummary/AccordionSummary.tsx).

```tsx
export default function AccordionSummary({
  children,
  expandIcon = <CaretIcon width={16} height={16} />,
  ...props
}: AccordionSummaryProps) { /* … */ }
```

**D. `forwardRef` — only when necessary.** Add ref forwarding **only** if a parent (MUI `Dialog`, `Popper`, transition group) needs to pass a DOM ref through. Do not add it prophylactically. See [Slide.tsx](../../../frontend/src/app/components/slide/Slide.tsx).

```tsx
const Slide = forwardRef(function Slide(
  { direction = "up", timeout = 500, ...props }: SlideProps,
  ref: Ref<unknown>,
) {
  return <MuiSlide ref={ref} direction={direction} timeout={timeout} {...props} />;
});
export default Slide;
```

### 4. Style through theme tokens only

Inside the `styled()` callback:

- **Use `theme.customProperties.borderRadius.*`**, `theme.customProperties.spacing.*` (if defined), `theme.palette.*`, `theme.spacing(n)`, `theme.breakpoints.up(...)`, `theme.transitions.*`. Never hardcoded pixel values or hex colors.
- **Prefer props and named slots first.** Reach for MUI internal-class selectors (`& .MuiX-y`) only when there's no prop / slot for what you need — they break silently across MUI majors. When you must, add a one-line comment noting why no prop covers it.
- **Do not extend the theme inside a wrapper.** If a new token is needed, add it to [frontend/src/themes/variables.ts](../../../frontend/src/themes/variables.ts) (or `palette.ts`) and augment `material-ui-pigment-css.d.ts` — then use it. See [mui-and-uikit.instructions.md — Theme extension](../../instructions/mui-and-uikit.instructions.md).
- **No `sx` overrides inside the wrapper** — `styled()` is the wrapper's tool. `sx` is for call-site adjustments.

Full token / theme rules live in [styling.instructions.md](../../instructions/styling.instructions.md).

### 5. Keep the wrapper presentational — no business logic

The wrapper is a styling + defaults layer. Do **not**:

- Fetch data, call services, read from a Zustand store, or use `useNavigate` / `useTranslation` inside the wrapper.
- Add analytics hooks, feature flags, or auth checks. Callers pass those in via props.
- Import from `@stores`, `@services`, `@containers`, `@pages`, `@forms`, `@hocs`, or `react-router-dom`.

If the component needs any of that, it's a **container**, not a component — see [components-vs-containers.instructions.md](../../instructions/components-vs-containers.instructions.md).

### 6. Register in the UiKit page

Every new wrapper under `@components/*` **must** get an entry in [frontend/src/app/pages/uikit/UiKit.tsx](../../../frontend/src/app/pages/uikit/UiKit.tsx). Use the snippet in [assets/UikitBlock.snippet.tsx](./assets/UikitBlock.snippet.tsx) as a starting point.

Rules:

- **`id`** — stable lowercase slug, no spaces (`chip`, `autocomplete`, `fieldhelpertext`). The `UikitNav` builds side-nav links from `.uikit-block` DOM nodes on mount.
- **`title`** — matches the component file name including extension (`Chip.tsx`, `Autocomplete.tsx`). This lets a reader grep from the guide straight to the source.
- **`codeBlock`** — template literal with the smallest useful usage. Omit only when the component isn't reasonably code-demonstrable (rare — layout containers).
- **Meaningful variants** — either multiple `<UikitBlock>` siblings or grouped inside one block (see how `FieldHelperText` shows both empty and error states in [UiKit.tsx](../../../frontend/src/app/pages/uikit/UiKit.tsx)).
- **Import the new wrapper** at the top of `UiKit.tsx` using the `@components/<name>/<Name>` path alias.
- **Do not add UiKit helpers under `@components/` roots.** `UikitBlock`, `UikitColor`, `UikitNav` are namespaced under `@components/uikit/*`; keep it that way.

Skipping UiKit registration is a silent design-system drift. Flag it as a missing step in reviews.

### 7. Switch existing call sites to the wrapper (if applicable)

If step 1 found existing raw imports (`import { X } from "@mui/material"` outside `@components/*`), migrate them:

```diff
- import { Chip } from "@mui/material";
+ import Chip from "@components/chip/Chip";
```

Do this only for the primitive you just wrapped. Do not sweep the codebase for unrelated primitives.

The two whitelisted exceptions stay untouched: `Typography` (`@mui/material/Typography`) and `Grid` / `Grid2` (`@mui/material/Grid2`).

### 8. Verify

From `frontend/`:

1. `yarn lint:scripts` — catches wrong imports, missing types, unused vars.
2. `yarn build` — full type check via `tsc -b`. Confirms the `styled()` + props types line up with Pigment-CSS.
3. `yarn dev` and open the UiKit page (`/uikit`) to visually confirm the wrapper and its variants render, and that the side-nav picks up the new entry.

## Completion Checklist

Before reporting done, verify all apply:

- [ ] Folder `frontend/src/app/components/<name>/` exists and contains only `<Name>.tsx`.
- [ ] File name is PascalCase and matches the component (`<Name>.tsx`).
- [ ] Imports the primitive + props type from `@mui/material` aliased (`import { XProps, X as MuiX } from "@mui/material"`).
- [ ] Imports `styled` from `@mui/material-pigment-css` (not `@mui/material/styles`, not `@emotion/*`).
- [ ] `StyledMuiX` declared above the component using `styled(MuiX)(({ theme }) => ({ … }))`.
- [ ] Props interface `IX extends XProps` (or `Omit<XProps, "…">`), inline, `I` prefix.
- [ ] Default export using `function` keyword: `export default function X(...)`.
- [ ] Defaults expressed via destructuring — no `defaultProps`.
- [ ] `{...props}` spread first, wrapper-controlled overrides after.
- [ ] All styling uses `theme.customProperties.*` / `theme.palette.*` / `theme.spacing(...)` / `theme.breakpoints.*` — no hardcoded values.
- [ ] No business logic, no forbidden imports (`@stores`, `@services`, `@pages`, `@containers`, `@forms`, `@hocs`, `react-router-dom`).
- [ ] No MUI internal-class selectors unless documented with a one-line comment on why no prop / slot covers it.
- [ ] `forwardRef` added only if a real parent requires it.
- [ ] The wrapper is registered in `UiKit.tsx` with `id`, matching `title`, and a `codeBlock`.
- [ ] Existing raw imports of this primitive outside `@components/*` have been migrated (`Typography` / `Grid` excluded).
- [ ] `yarn lint:scripts` passes.
- [ ] `yarn build` passes.

## Anti-patterns to Reject

- Importing raw `@mui/material` primitives from pages / forms / containers instead of using the wrapper (only `Typography` and `Grid`/`Grid2` are exceptions).
- Importing `styled` / `css` from `@mui/material/styles`, `@emotion/*`, or `styled-components` — Pigment-CSS is the only runtime.
- Bringing in `@emotion/react`, `@emotion/styled`, or `styled-components` as new dependencies.
- Skipping `styled()` and inlining `sx` inside the wrapper — `styled()` is the wrapper tool; `sx` is for call sites.
- Hardcoded colors, radii, or spacing values inside `styled()` — always theme tokens.
- `defaultProps` — deprecated in React 18+, use destructuring defaults.
- `export default (props) => …` (anonymous arrow default export) — must be `export default function X(...)`.
- Duplicating a wrapper that already exists — grep `@components/*` first.
- Adding an `index.ts` barrel under a component folder — import the file directly.
- Skipping the UiKit registration.
- Extending the theme inside the wrapper file — theme extensions belong in `themes/variables.ts` + `material-ui-pigment-css.d.ts`.
- Overriding MUI globally in `theme.ts` for a one-off — express it in the wrapper.
- Adding business logic (`useNavigate`, `useTranslation`, store access, service calls) — that makes it a container.
- Ref-forwarding prophylactically — add `forwardRef` only when a real parent needs it.
- Importing `@mui/icons-material` in new code — use the SVG icons under `@icons/*` (see `icons.instructions.md`).
- Using deep paths like `@mui/material/Chip` when the top-level barrel exports the primitive.

## References

- [mui-and-uikit.instructions.md](../../instructions/mui-and-uikit.instructions.md) — the full rules this skill enforces.
- [styling.instructions.md](../../instructions/styling.instructions.md) — theme tokens, `styled()` vs `sx`, utility classes.
- [components-vs-containers.instructions.md](../../instructions/components-vs-containers.instructions.md) — where a wrapper stops being a wrapper.
- [icons.instructions.md](../../instructions/icons.instructions.md) — the `IIcon` contract used instead of `@mui/icons-material`.
- [react.instructions.md](../../instructions/react.instructions.md) — `function` keyword, default export, props interface shape.
- [typescript.instructions.md](../../instructions/typescript.instructions.md) — `I` prefix, path aliases, strictness.
- `add-form`, `add-page`, `add-service` skills — sister skills that consume these wrappers.

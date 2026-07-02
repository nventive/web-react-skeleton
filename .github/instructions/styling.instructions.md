---
description: Styling conventions — utility classes, theme tokens, styled components, SCSS/CSS Modules, and what NOT to do.
applyTo: "frontend/src/**/*.{scss,tsx},frontend/src/themes/**/*.ts"
---

# Styling

Scope: SCSS files, CSS Modules, styled components, and the `className` decisions inside `.tsx`. Also covers `frontend/src/themes/` because it defines the tokens everything else consumes.

Complementary files (do not repeat their content here):
- [react.instructions.md](react.instructions.md) — JSX rules (this file expands on the "no inline styles" rule).
- [typescript.instructions.md](typescript.instructions.md) — path aliases, naming.
- [components-vs-containers.instructions.md](components-vs-containers.instructions.md) — where styling code lives.
- [mui-and-uikit.instructions.md](mui-and-uikit.instructions.md) — the pattern for **wrapping** an MUI component (this file covers styling **inside** those wrappers).
- [icons.instructions.md](icons.instructions.md) — SVG-icon-specific styling rules (theme fills via `sx`).

---

## The five layers, in priority order

When adding style, pick the first tool from this list that fits. Do not skip layers.

1. **Utility classes** from [frontend/src/styles/_globals.scss](frontend/src/styles/_globals.scss) and [frontend/src/styles/_export.scss](frontend/src/styles/_export.scss) — one-off spacing, flex, alignment.
2. **`<Typography>` variants** from the theme — anything text-related.
3. **Pigment-CSS `styled()`** with `theme.customProperties.*` / `theme.palette.*` — wrapping a MUI component, custom layout that reads theme tokens.
4. **Pigment-CSS `sx` prop** (`sx={(theme) => ({ ... })}`) — one-off theme-value access on a plain element (see the `sx` section below).
5. **CSS Modules (`*.module.css`)** — container-scoped visuals with multiple related classes.
6. **Colocated component SCSS (`<component>.scss`) with BEM** — only when none of the above apply. Rare in the current codebase.

**Do not** reach for inline `style={{...}}` or a new global class.

---

## Utility classes (the first stop)

Prefer utility classes over any other tool for spacing, flexbox, and simple positioning. They are auto-generated from the design tokens, so they always match the theme.

### Spacing (auto-generated, see `_export.scss`)

Scale keys: `a` (`auto`), `xxs`, `xs`, `sm`, `md`, `lg`, `xl`, `xxl` — resolved to CSS variables under `--mui-customProperties-spacing-*`.

| Pattern | Example | Effect |
|---|---|---|
| `gap-<key>` | `gap-md` | `gap` |
| `m<dir>-<key>` | `m-xs`, `mx-md`, `mt-lg`, `ml-a` | `margin` (`dir` ∈ `""`, `x`, `y`, `l`, `r`, `t`, `b`) |
| `p<dir>-<key>` | `p-md`, `px-lg`, `pt-xs` | `padding` (same directions) |
| `<position>-<key>` | `top-xs`, `bottom-md`, `left-a`, `right-lg` | absolute-position offsets |

Reference direction map: `""` = all, `x` = left+right, `y` = top+bottom, `l/r/t/b` = single side.

### Layout & alignment (from `_globals.scss`)

| Class | Effect |
|---|---|
| `flex` | `display: flex` |
| `flex-column` | `display: flex; flex-direction: column` |
| `flex-1` | `flex: 1` |
| `flex-grow` | `flex-grow: 1` |
| `align-center` | `align-items: center` |
| `justify-center` / `justify-between` / `justify-start` / `justify-end` | `justify-content: ...` |
| `text-center` | `text-align: center` |
| `position-absolute` / `-fixed` / `-relative` / `-sticky` | `position: ...` |

### Composing utilities

```tsx
// Good — utility classes for spacing/layout, semantic class for the component
<div className="admin flex-column gap-xs">...</div>

// Good — conditional composition with classnames
import cx from "classnames";
<div className={cx("card", "p-md", { "mt-lg": hasHeader })} />
```

Do not re-implement utility styles in a component `.scss` (e.g. `.card { display: flex; }` when `flex` already exists).

### Why `#body .foo`? (gotcha)

The generator emits utility selectors prefixed with `#body` (see `_export.scss`) to win specificity against MUI's own class rules. Consequence: a plain `.card { margin: 0; }` in a component `.scss` **cannot** override a utility class applied to the same element. If you need to override, either drop the utility class or increase specificity on your rule.

---

## Theme is the single source of truth

The MUI theme is created with `cssVariables: true` (see [frontend/src/themes/theme.ts](frontend/src/themes/theme.ts)), so every value is available both as `theme.<path>` in TS and as `var(--mui-<path>)` in CSS/SCSS.

### Token map

| Concern | Access in `styled()` / TS | Access in CSS / SCSS | Defined in |
|---|---|---|---|
| Spacing scale (`a`/`xxs`…`xxl`) | `theme.customProperties.spacing.md` | `var(--mui-customProperties-spacing-md)` | `themes/variables.ts` |
| MUI numeric spacing | `theme.spacing(2)` | — | (0.25rem × n) |
| Border radius (`xs`/`sm`/`md`/`lg`) | `theme.customProperties.borderRadius.md` | `var(--mui-customProperties-borderRadius-md)` | `themes/variables.ts` |
| Palette | `theme.palette.primary.main` | `var(--mui-palette-primary-main)` | `themes/palette.ts` |
| Typography | use `<Typography variant="...">` | — | `themes/typography.ts` |
| Breakpoints | `theme.breakpoints.up("md")` | `@include media-min(md)` | `themes/variables.ts` |
| z-index | `theme.zIndex.<name>` | `var(--mui-zIndex-<name>)` | `themes/variables.ts` |

**Never hardcode a color, spacing, radius, or z-index.** If a value isn't in the theme, add it to the theme (see next section) rather than inlining it. There is one `// TODO: get this from theme` in `Layout.tsx` for a background color — that is a bug to fix, not a pattern to copy.

### Adding a new token

1. Add it to the appropriate map in [frontend/src/themes/variables.ts](frontend/src/themes/variables.ts) (`spacingValues`, `borderRadius`, `zIndex`) or the palette in `palette.ts`.
2. If it's a **new named token type** (not an addition to an existing map), extend the augmentation in [frontend/src/material-ui-pigment-css.d.ts](frontend/src/material-ui-pigment-css.d.ts). The `CustomSpacing`, `CustomBorderRadius`, and `ZIndex` interfaces are already augmented there — mirror the pattern.
3. Do **not** add a raw SCSS variable in `_variables.scss` unless it maps to a theme value via CSS vars, matching the existing `$spacing` map.

---

## Pigment-CSS `styled()`

Use for anything that goes beyond utility classes: MUI wrappers, custom layout containers, anything that needs to read theme tokens.

### Rules

- Import: `import { styled } from "@mui/material-pigment-css";` (**not** `@mui/material/styles`).
- Named `Styled<Base>` (e.g. `StyledMuiButton`, `StyledMuiDialog`, `LayoutContainer`) and defined **above** the exported component in the same file.
- Access tokens via `theme.customProperties.*` / `theme.palette.*` / `theme.breakpoints.up(...)`.
- Style names use `camelCase` when using object syntax. When using string selectors (`> .content`, `& .MuiDialog-paper`), quote them.
- Media queries via `theme.breakpoints.up(<key>)` — never hardcode a `min-width` pixel value.
- Do **not** target MUI internal classes (`.MuiButtonBase-root`, `.MuiOutlinedInput-notchedOutline`, …) if you can style via a prop or a named slot instead — they change between MUI versions.

### Canonical examples

```tsx
// Canonical wrapper style — styled(MuiPrimitive) reading a theme token
const StyledMuiButton = styled(MuiButton)(({ theme }) => ({
  borderRadius: theme.customProperties.borderRadius.xs,
}));
```

```tsx
// styled('main') layout container — media queries via breakpoints
const LayoutContainer = styled("main")(({ theme }) => ({
  width: "100%",
  display: "flex",
  flexDirection: "column",
  padding: theme.spacing(2),

  [theme.breakpoints.up("md")]: { padding: theme.spacing(4) },
  [theme.breakpoints.up("lg")]: { padding: theme.spacing(6) },
  [theme.breakpoints.up("xl")]: { padding: theme.spacing(8) },

  "> .content": {
    maxWidth: "82.5rem",
    width: "100%",
  },
}));
```

### `sx` prop — for one-off theme access, not for hardcoded styles

Unlike vanilla MUI, the `sx` prop in this project is provided by **Pigment-CSS** and compiled to static CSS at build time — it has no runtime cost. It is an accepted escape hatch when you need to pull a **theme value** (palette, `zIndex`, `spacing()`, `transitions`) onto a one-off element that doesn't warrant its own `styled()` wrapper.

Rules:
- Always use the callback form: `sx={(theme) => ({ ... })}`. The static object form loses theme access.
- Only reach for `sx` when the style **needs `theme`**. Hardcoded values (`{ padding: 8, color: "#fff" }`) belong in `styled()` — or better, in a utility class.
- Prefer, in order: utility class → `styled()` component → `sx` prop.
- `sx` is fine on plain elements (`<div>`, `<span>`, `<pre>`, SVG `<path>`) and on MUI components. Do not chain multiple `sx` overrides across parent/child when a single `styled()` wrapper would express the same intent.

Real examples from the repo:

```tsx
// Full-screen overlay — pulls zIndex + palette from theme
<div
  ref={nodeRef}
  className={classes["loading"]}
  sx={(theme) => ({
    backgroundColor: theme.palette.common.white,
    zIndex: theme.zIndex.loading,
  })}
/>
```

```tsx
// SVG icon path — fill via theme
<path
  d="..."
  sx={(theme) => ({ fill: theme.palette.common.white })}
/>
```

**Banned entirely**: `style={{ ... }}` inline styles.

---

## CSS Modules (`*.module.css`)

Use for **container-scoped** styles that need multiple related classes and don't map cleanly to utility classes.

- File name: kebab-case matching the component, `<component>.module.css` (e.g. `<component-name>.module.css`).
- Class names inside the module: kebab-case (`.container`, `.content`, `.local`, `.dev`).
- Import as `classes`: `import classes from "./<component-name>.module.css";`
- Compose with `classnames` when applying conditionally:

```tsx
import classNames from "classnames";
import classes from "./<component-name>.module.css";

<div
  className={classNames(classes["content"], {
    [classes["local"]]: __ENV__ === "local",
    [classes["dev"]]: __ENV__ === "dev",
  })}
/>
```

- CSS Modules can (and do) coexist with utility classes on the same element.

CSS Modules are for **containers** in the current repo. Presentational components under `@components/*` typically don't need them because they wrap a single MUI primitive via `styled()`.

---

## Component `.scss` files (BEM, colocated)

Reach for this only when Pigment-CSS + utility classes can't express the visual (rare — e.g. complex pseudo-element art, keyframes, deeply nested static markup).

Rules:

- File name: lowercase matching the component (e.g. `admin.scss` next to `Admin.tsx`).
- Import at the top of the `.tsx`: `import "./admin.scss";`
- Class names follow [BEM](https://getbem.com/naming/): `.block`, `.block__element`, `.block--modifier`.
- Use `@use "@styles/variables" as v;` and `@use "@styles/mixins/media-queries" as mq;` — never `@import`.
- Media queries live below the same-level ruleset, separated by a blank line:

```scss
.admin {
  display: flex;
  flex-direction: column;

  @include mq.media-min(md) {
    flex-direction: row;
  }

  &__title {
    margin-bottom: var(--mui-customProperties-spacing-md);
  }

  &--compact {
    padding: var(--mui-customProperties-spacing-xs);
  }
}
```

- No hardcoded colors, spacing, radii — reference CSS variables from the theme.
- **Avoid `!important` at all costs.** If you must use it, add a one-line comment explaining why on the same line.

---

## Media queries

Two equivalent tools depending on where you are:

- **In `.scss`**: `@use "@styles/mixins/media-queries" as mq;` then `@include mq.media-min(md) { ... }`, `mq.media-max(md)`, `mq.media-range(sm, lg)`. Breakpoint keys: `xs`, `sm`, `md`, `lg`, `xl`.
- **In Pigment-CSS `styled()`**: `[theme.breakpoints.up("md")]: { ... }` / `.down("md")` / `.between("sm", "lg")`.
- **In JS**: `useMediaQuery` — only when a CSS media query would be significantly more work. It's less efficient (JS-driven re-renders).

Breakpoint values (informational — don't hardcode them):

| Key | px |
|---|---|
| `xs` | 640 |
| `sm` | 768 |
| `md` | 1024 |
| `lg` | 1280 |
| `xl` | 1440 |

---

## Typography

- Always render text through MUI `<Typography variant="...">`. Never set `font-family`, `font-size`, or `font-weight` in a component.
- Available variants (from `themes/typography.ts`): `h1`–`h6`, `subtitle1`/`subtitle2`, `body1`/`body2`, `button`, `caption`, `overline`. Add new ones in `typography.ts` if a genuinely new style is needed.
- Font family is `InterTight` with weights 400/500/600/700 declared in `_fonts.scss`. Do not import additional fonts without team discussion.

```tsx
// Good
<Typography variant="h4" className="mb-xl">{t("home__welcome")}</Typography>

// Bad — hardcoded font sizing
<div style={{ fontSize: 24, fontWeight: 600 }}>{t("home__welcome")}</div>
```

---

## Global styles are read-only by default

`src/styles/*` defines the design system: utility class generator, resets, fonts, globals. **Do not** add a new class to `_globals.scss` for a one-off need — that belongs in the component's own styling. Extend the global layer only when adding a token or a truly system-wide primitive, and prefer changing `themes/variables.ts` first.

Files and their roles:

| File | Purpose |
|---|---|
| `index.scss` | Entry — forwards the layers below (imported once in `App.tsx`). |
| `_globals.scss` | Layout / alignment utility classes (`flex`, `align-center`, `justify-*`, `position-*`). |
| `_export.scss` | Auto-generates spacing/gap/padding/margin/position utility classes from the spacing scale. |
| `_variables.scss` | SCSS `$spacing` / `$direction` maps that mirror MUI theme tokens as CSS variables. |
| `_fonts.scss` | `@font-face` declarations for InterTight. |
| `mixins/_generics.scss` | `rem($px)`, `get($map, $key)` helpers. |
| `mixins/_media-queries.scss` | `media-min` / `media-max` / `media-range` mixins. |
| `mixins/_normalize.scss` | CSS reset. |
| `vendors/toastify.css` | Third-party overrides. |

---

## Things to avoid

- `style={{ ... }}` inline styles.
- MUI `sx` with hardcoded values (colors, sizes, pixels). If it doesn't need `theme`, it doesn't need `sx` — use a utility class or `styled()`.
- Hardcoded colors (`#fafafb`, `#42a5f5`, …) — use `theme.palette.*` or add a token.
- Hardcoded spacing (`padding: 16px`, `margin: 8px`) — use utility classes or `theme.customProperties.spacing.*`.
- Hardcoded pixel border-radii — use `theme.customProperties.borderRadius.*`.
- Hardcoded pixel breakpoints — use `theme.breakpoints.*` or the `media-*` mixins.
- Hardcoded z-index numbers — extend `zIndex` in `themes/variables.ts` and reference by name.
- `!important` (unless commented and unavoidable).
- Targeting MUI internal `Mui*` classes when a slot / prop / named part exists.
- `@import` in SCSS — use `@use` / `@forward`.
- Adding a barrel `_index.scss` for components — colocate the `.scss` and import from the `.tsx`.
- Duplicating utility-class behaviour inside a component `.scss` (e.g. re-declaring `display: flex`).
- Adding new fonts, or overriding `font-family` at the component level.

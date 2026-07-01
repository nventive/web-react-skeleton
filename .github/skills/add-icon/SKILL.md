---
name: add-icon
description: "Add a hand-wrapped inline SVG icon to the web-react-skeleton React SPA. Use when: adding a new icon, wrapping an SVG, creating a file under frontend/src/app/icons/, importing from @icons/*, replacing an @mui/icons-material / react-icons / lucide-react / heroicons / font-awesome import, adding an accordion caret / close / add / logout / cookie icon, or theming an SVG fill via the sx prop. Enforces the flat folder layout (icons/<Name>.tsx + shared IIcon.ts), the IIcon contract with no per-icon prop widening, the mandatory <title>{alt}</title>, sx-callback + theme.palette.* fill (never hex / named color / currentColor), matched width/height defaults from the viewBox, and the no-icon-library rule."
argument-hint: "<IconName> — PascalCase, e.g. 'ChevronRounded', 'SearchOutlined', 'UserCircleIcon'"
---

# Add an SVG Icon

Wrap a raw SVG as a repo icon under `frontend/src/app/icons/<Name>.tsx` following the project's `IIcon` contract and the `sx` + theme-token fill pattern.

## When to Use

- User asks to "add an icon", "wrap this SVG", "create a `<Name>Icon>`", "add a Chevron icon", etc.
- User pastes SVG markup and wants it as a reusable React component.
- User writes `import X from "@mui/icons-material/X"` (or `react-icons`, `lucide-react`, `heroicons`, `font-awesome`) — those imports are banned; wrap the SVG instead.
- User needs an icon inside a `Button`, `IconButton`, `AccordionSummary`, etc. and no icon under `@icons/*` matches.

Do **not** use this skill for:
- Editing an existing icon — just edit it in place following the same template.
- Adding an icon-library dependency (`@mui/icons-material`, `react-icons`, `lucide-react`, `heroicons`, Font Awesome). The repo has zero icon-library imports and that must stay true.
- Wrapping a full interactive control (e.g. an icon-button with click handlers) — that's a component under `@components/*`. See the `add-mui-component` skill.
- Adding a raster / bitmap asset (PNG / JPG / WebP) — those go under `frontend/src/assets/images/`, not `@icons/*`.
- Registering icons in the UiKit page — icons are **assets**, not UI components, and are intentionally not listed there today.

## Inputs to Confirm

Before starting, confirm with the user (ask only what's missing):

1. **Icon name** — PascalCase, describes the shape or action. Follow the source's suffix if there's a variant family (`Rounded`, `Outlined`, `Sharp`, `Filled`). Examples: `AddRounded`, `ExternalLinkOutlined`, `CookieIcon`, `CaretIcon`. If the source is from Material Symbols / Feather / a design file, mirror that name.
2. **SVG source** — the raw `<svg>…</svg>` markup or a file path. Must include a `viewBox` (or explicit `width` / `height` you can derive one from).
3. **Fill mode** — one of:
   - **Monochrome** (single color for the whole graphic) → use the monochrome-shortcut template (`sx` on `<svg>`, no `fill="none"`).
   - **Multi-color** (different fills per shape) → use the per-path template (`sx` on each `<path>` / `<circle>` / `<rect>`, `fill="none"` on `<svg>`).
4. **Palette token** — pick from what's already in use before inventing a new one:
   - `theme.palette.common.white` — icons rendered on colored buttons.
   - `theme.palette.grey[800]` — neutral UI chrome.
   - `theme.palette.primary.main` — brand-colored accents.
   If none fit, add a new token to [themes/palette.ts](../../../frontend/src/themes/palette.ts) / [themes/variables.ts](../../../frontend/src/themes/variables.ts) and augment [material-ui-pigment-css.d.ts](../../../frontend/src/material-ui-pigment-css.d.ts) first — do **not** paste raw hex.
5. **Alt text default** — the spaced version of the PascalCase name (`AddRounded` → `"Add Rounded"`, `CookieIcon` → `"Cookie Icon"`). Consumers override it when the icon is the sole affordance in an interactive control.

If the user just says "add a chevron icon", pick the closest existing pattern (`CaretIcon` for a monochrome caret, `AddRounded` for a single-path filled monochrome, `CookieIcon` for a multi-shape monochrome, `ExternalLinkOutlined` for a non-24 sized icon) and confirm in the summary.

## The Icon Pattern (Ground Truth)

Every icon is exactly one file:

```
frontend/src/app/icons/
├── IIcon.ts               # shared props interface — .ts (no JSX), never edit for per-icon needs
└── <Name>.tsx             # one file per icon, PascalCase, default export
```

- **Flat folder.** No subfolders per icon or per category.
- **No barrel `index.ts`.** Consumers import each icon by name: `import CaretIcon from "@icons/CaretIcon";`.
- **`IIcon.ts` is `.ts`**, not `.tsx` — no JSX in the shared props file. Never widen it for a single icon (see the "local extension" mistake below).
- **Path alias `@icons`** everywhere outside the `icons/` folder. Inside `icons/`, the sibling import `import IIcon from "./IIcon";` is the one relative import allowed.

The `IIcon` contract — every icon accepts exactly this shape, no more, no less:

```ts
export default interface IIcon {
  className?: string;
  color?: string;
  width?: number;
  height?: number;
  alt?: string;
}
```

Canonical monochrome shape (from [icons/CookieIcon.tsx](../../../frontend/src/app/icons/CookieIcon.tsx)):

```tsx
import IIcon from "./IIcon";

export default function CookieIcon({
  className,
  width = 24,
  height = 25,
  alt = "Cookie Icon",
}: IIcon) {
  return (
    <svg
      className={className}
      width={width}
      height={height}
      viewBox="0 0 24 25"
      sx={(theme) => ({
        fill: theme.palette.primary.main,
      })}
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>{alt}</title>
      <path d="…" />
      <circle cx="…" cy="…" r="…" />
    </svg>
  );
}
```

Canonical per-path multi-color shape (from [icons/AddRounded.tsx](../../../frontend/src/app/icons/AddRounded.tsx)):

```tsx
import IIcon from "./IIcon";

export default function AddRounded({
  className,
  width = 24,
  height = 24,
  alt = "Add Rounded",
}: IIcon) {
  return (
    <svg
      className={className}
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>{alt}</title>
      <path
        d="M18 13H13V18…"
        sx={(theme) => ({
          fill: theme.palette.common.white,
        })}
      />
    </svg>
  );
}
```

## Procedure

Follow every step in order. Do not skip.

### 1. Verify the icon doesn't already exist

- List [frontend/src/app/icons/](../../../frontend/src/app/icons) and confirm no file matches the intended name (case-insensitively) or the same shape under a different name (grep for a distinctive fragment of the `d=` path if the user pasted SVG).
- Grep the codebase for banned icon-library imports the user might be replacing: `@mui/icons-material`, `react-icons`, `lucide-react`, `heroicons`, `@fortawesome`. Any hit outside `package.json` is a migration target for after step 5.
- If the icon already exists, stop and edit it in place — do not create a second file.

### 2. Optimize the SVG source

Before writing the file, strip the raw markup down:

1. Run through SVGO or an equivalent optimizer (Figma-exported SVGs are the worst offenders).
2. Keep only: `viewBox`, `<path>` / `<circle>` / `<rect>` / `<polygon>` geometry, and geometry-only attributes (`d`, `cx`, `cy`, `r`, `x`, `y`, `width`, `height`, `fillRule`, `clipRule`, `strokeWidth` if meaningful).
3. Strip: `id`, `class`, `style`, inline `fill` / `stroke`, `stroke-width` when it's `0` or the default, `data-*`, XML comments, `<defs>` / `<g>` / `<use>` unless they carry real geometry, `<metadata>`, `<title>` from the source (you'll add your own).
4. Flag `<defs>` with gradients, `<mask>`, `<filter>`, or embedded `<style>` blocks and confirm with the designer before continuing — the repo doesn't have any today.
5. Confirm the `viewBox` matches the intended natural size. If it's not `0 0 24 24`, you'll set the `width` / `height` defaults accordingly.

### 3. Create the file

Create `frontend/src/app/icons/<Name>.tsx`. Pick **one** template — do not mix.

- **Monochrome shortcut** — every shape shares one color. Copy [assets/Icon.tsx.template](./assets/Icon.tsx.template).
- **Per-path multi-color** — different fills per shape (or you want each `<path>` addressable). Copy [assets/IconMultiColor.tsx.template](./assets/IconMultiColor.tsx.template).

Replace `__Name__` (PascalCase, e.g. `Chevron`), `__ViewBoxW__` / `__ViewBoxH__` (the natural size from the `viewBox`), `__AltText__` (spaced name, e.g. `"Chevron"`), and paste the geometry.

Invariants (from [icons.instructions.md](../../instructions/icons.instructions.md)):

- **Import `IIcon` from `./IIcon`** — the one relative import allowed inside `@icons/*` (it's a sibling). Anywhere else, `@icons/…`.
- **`function <Name>({ … }: IIcon)`** with defaults destructured inline. No `defaultProps` (deprecated in React 18+).
- **`width` and `height` default to the `viewBox` natural size** — matched exactly (`viewBox="0 0 16 16"` → `width = 16, height = 16`). Never mismatch — `width = 24` with `height = 18` distorts.
- **`alt` defaults to a human-readable spaced version** of the component name (`"Add Rounded"`, not `"AddRounded"` or `"add-rounded"`).
- **`className` and `color` do not get defaults.** The `color` field is currently unused by existing icons — leave it in the destructure only if you actually wire it. Do **not** remove it from `IIcon.ts`.
- **`<svg>` attributes in this exact order:** `className`, `width`, `height`, `viewBox`, then either `fill="none"` (per-path variant) or the `sx` callback (monochrome variant), then `xmlns="http://www.w3.org/2000/svg"`. Keep `xmlns` even though React strips it in places — it's expected by tooling.
- **`<title>{alt}</title>` is the first child of `<svg>`.** Non-negotiable — it's the accessible name for screen readers. Skipping it breaks a11y.
- **Fill is set via `sx` callback → theme token.** `sx={(theme) => ({ fill: theme.palette.<slot> })}`. Never `fill="#123456"`, never `fill="white"`, never `fill="currentColor"`.
- **Do not mix per-`<path>` `sx` with an `<svg>`-level `sx` fill** in the same icon. Pick one variant.
- **Monochrome variant drops `fill="none"` from `<svg>`** so the `sx` fill reaches the children. Per-path variant keeps `fill="none"` so per-path `sx` fills win.
- **Never add per-icon props by extending `IIcon` for one file.** If a single icon truly needs an extra input (e.g., an animation toggle), define a local interface in that `.tsx` and leave `IIcon.ts` alone (see mistake #4 below).

### 4. Wire the fill through the theme

Inside every `sx` callback:

- **Callback form only:** `sx={(theme) => ({ fill: theme.palette.<slot> })}`. Never `sx={{ fill: "…" }}`.
- **Pick from the tokens already in use first:** `theme.palette.common.white`, `theme.palette.grey[800]`, `theme.palette.primary.main`. Only introduce a new token when none fits.
- **If several shapes share a fill in a per-path icon, repeat the `sx` block on each element.** Do not hoist to `<svg>` unless you're switching to the monochrome variant for the whole icon.
- **Adding a new palette token** = edit [themes/palette.ts](../../../frontend/src/themes/palette.ts) (or [themes/variables.ts](../../../frontend/src/themes/variables.ts) for custom slots), then augment [material-ui-pigment-css.d.ts](../../../frontend/src/material-ui-pigment-css.d.ts). Only then use it here. Full rules in [styling.instructions.md](../../instructions/styling.instructions.md).

### 5. Import at the call site

```tsx
import LogoutRounded from "@icons/LogoutRounded";

// Icon next to a button label
<Button variant="contained" onClick={onLogout}>
  <LogoutRounded className="mr-xs" />
  <Typography variant="button">{t("home__logout")}</Typography>
</Button>
```

Rules (from [icons.instructions.md](../../instructions/icons.instructions.md)):

- **Always import via `@icons/<Name>`** — never a relative path from outside `icons/`.
- **`className` carries spacing**, not size. Size overrides are rare and require both `width` and `height` set together.
- **Do not scale via CSS `transform: scale(...)`** — blurs SVGs on some browsers. Use `width` / `height` props.
- **Do not wrap icons in `<span>` / `<div>` for styling.** Put utility classes directly on the icon.
- **Set a domain-specific `alt`** when the icon is the sole affordance in a control (icon-only button). Decorative icons next to labeled text can keep the default.
- **Icons live inside interactive elements** (`Button`, `IconButton`), not the other way around.

### 6. Migrate banned icon-library imports (if applicable)

If step 1 found `@mui/icons-material`, `react-icons`, `lucide-react`, `heroicons`, or `@fortawesome` imports, migrate them now:

```diff
- import AddIcon from "@mui/icons-material/Add";
+ import AddRounded from "@icons/AddRounded";
```

Do this only for the icon you just wrapped. Do not sweep the codebase for unrelated icon-library imports in the same change.

### 7. Verify

From `frontend/`:

1. `yarn lint:scripts` — catches wrong imports, missing types, unused vars.
2. `yarn build` — full type check via `tsc -b`. Confirms the `IIcon` types and the `sx` callback typing line up with Pigment-CSS.
3. `yarn dev` — visually confirm the icon renders at the intended size and color in its consuming context.

## Completion Checklist

Before reporting done, verify all apply:

- [ ] File `frontend/src/app/icons/<Name>.tsx` exists, PascalCase name matches the component.
- [ ] `import IIcon from "./IIcon";` — the sibling relative import.
- [ ] `export default function <Name>({ … }: IIcon)` — default export, `function` keyword, `IIcon` prop type (or a local interface that extends it for a single-icon extension).
- [ ] `width` and `height` defaults match the `viewBox` exactly (`viewBox="0 0 16 16"` → `width = 16, height = 16`).
- [ ] `alt` default is the spaced PascalCase name (`"Add Rounded"`, not `"AddRounded"`).
- [ ] `<svg>` attributes in the canonical order (`className`, `width`, `height`, `viewBox`, then `fill="none"` **or** the `sx` callback, then `xmlns`).
- [ ] `<title>{alt}</title>` is the first child of `<svg>`.
- [ ] Fill uses `sx={(theme) => ({ fill: theme.palette.<slot> })}` on every colored shape — no hex, named color, or `currentColor`.
- [ ] The two variants are not mixed (either `sx` on `<svg>` for monochrome **or** `sx` on each `<path>` — never both).
- [ ] Monochrome variant drops `fill="none"` from `<svg>`; per-path variant keeps it.
- [ ] `IIcon.ts` was **not** widened for a per-icon prop (any extra prop is a local interface in the icon's own file).
- [ ] No barrel `index.ts` was added under `icons/`.
- [ ] Consumers import via `@icons/<Name>`, not a relative path.
- [ ] Banned icon-library imports the wrap replaces are migrated (`@mui/icons-material`, `react-icons`, `lucide-react`, `heroicons`, `@fortawesome`).
- [ ] `yarn lint:scripts` passes.
- [ ] `yarn build` passes.

## Common Mistakes to Reject

### 1. Hardcoded fill

```tsx
// Bad
<path d="…" fill="#4A6DE5" />
// Good — theme-driven, dark-mode-friendly
<path d="…" sx={(theme) => ({ fill: theme.palette.primary.main })} />
```

### 2. Missing `<title>`

```tsx
// Bad — no accessible name
<svg …><path … /></svg>
// Good
<svg …><title>{alt}</title><path … /></svg>
```

### 3. Distorted resize

```tsx
// Bad — 16×16 icon forced to 24 wide, keeps 16 tall → squashed
<ExternalLinkOutlined width={24} />
// Good — both dimensions, matched proportions
<ExternalLinkOutlined width={24} height={24} />
```

### 4. Widening `IIcon` for a single case

```ts
// Bad — every icon now advertises a prop it ignores
export default interface IIcon {
  className?: string;
  color?: string;
  width?: number;
  height?: number;
  alt?: string;
  spinning?: boolean;   // used by one icon
}
```

```tsx
// Good — local extension inside that icon only
interface ISpinnerIcon extends IIcon {
  spinning?: boolean;
}
export default function SpinnerIcon({ spinning, ...rest }: ISpinnerIcon) { … }
```

### 5. Pulling from an icon library

```tsx
// Bad — new dependency, bypasses the theming pipeline
import AddIcon from "@mui/icons-material/Add";
// Good — wrap the SVG once, reuse everywhere
import AddRounded from "@icons/AddRounded";
```

### 6. Sizing with CSS `transform`

```tsx
// Bad — blurry on subpixel scales
<CaretIcon className="scale-150" />
// Good
<CaretIcon width={36} height={36} />
```

### 7. Wrapping icons in a `<div>` for spacing

```tsx
// Bad
<div className="mr-xs"><LogoutRounded /></div>
// Good
<LogoutRounded className="mr-xs" />
```

### 8. `fill="currentColor"` and inherited CSS color

```tsx
// Bad — the repo doesn't rely on CSS color inheritance for icons
<svg fill="currentColor">…</svg>
```

Use `sx` + theme token instead. Single source of truth, works statically with Pigment-CSS.

### 9. Mixing `<svg>`-level and `<path>`-level `sx` fills

```tsx
// Bad — unpredictable which wins
<svg sx={(theme) => ({ fill: theme.palette.primary.main })}>
  <path d="…" sx={(theme) => ({ fill: theme.palette.common.white })} />
</svg>
```

Pick one variant. If shapes need different colors, use per-path only and keep `fill="none"` on `<svg>`.

### 10. Multi-file icon "components"

```
// Bad — barrel + colocated helpers
icons/chevron/
├── index.tsx
├── Chevron.tsx
└── helpers.ts
```

One file per icon, flat, no barrel.

## Anti-patterns to Reject

- Adding an icon-library dependency (`@mui/icons-material`, `react-icons`, `lucide-react`, `heroicons`, Font Awesome).
- Barrel exports from `@icons`.
- Extending `IIcon` in `IIcon.ts` for one-off props.
- Hardcoded fills (hex, named color, `currentColor`).
- Missing `<title>`.
- Mismatched `width` / `height` for non-square icons.
- Sizing via CSS `transform: scale(...)`.
- Wrapping icons in extra elements for spacing.
- Mixing `<svg>`-level and `<path>`-level `sx` fills in the same icon.
- Emojis in place of icons.
- Inline `<style>` blocks or `<defs>` with gradients unless the design absolutely requires it — flag it and confirm with a designer first.
- Registering icons in `@pages/uikit` — icons are assets today, not UI components (revisit only if the design system explicitly adds an icon swatch page).
- Named exports for an icon file — always `export default function <Name>(...)`.

## References

- [icons.instructions.md](../../instructions/icons.instructions.md) — the full rules this skill enforces.
- [styling.instructions.md](../../instructions/styling.instructions.md) — `sx` callback form, theme palette tokens, utility classes.
- [mui-and-uikit.instructions.md](../../instructions/mui-and-uikit.instructions.md) — why the repo doesn't use `@mui/icons-material`.
- [react.instructions.md](../../instructions/react.instructions.md) — functional-component shape, default export, `function` keyword.
- [typescript.instructions.md](../../instructions/typescript.instructions.md) — `I` prefix, path aliases, strictness.
- [components-vs-containers.instructions.md](../../instructions/components-vs-containers.instructions.md) — icons are assets, not components; they get their own folder.
- `add-mui-component` skill — sister skill for interactive MUI wrappers (which is what usually **hosts** an icon).

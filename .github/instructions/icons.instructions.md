---
description: Icon conventions — the IIcon contract, SVG template, theming via sx, defaults, and usage patterns.
applyTo: "frontend/src/app/icons/**/*.{ts,tsx}"
---

# Icons

Scope: everything under `@icons/*`. Icons are hand-wrapped inline SVGs, one file per icon, all conforming to the shared `IIcon` contract.

Complementary files (do not repeat their content here):
- [typescript.instructions.md](typescript.instructions.md) — `I` prefix, default-export naming, file naming.
- [react.instructions.md](react.instructions.md) — functional-component shape.
- [styling.instructions.md](styling.instructions.md) — `sx` callback form, theme palette tokens, utility classes.
- [mui-and-uikit.instructions.md](mui-and-uikit.instructions.md) — why the repo doesn't use `@mui/icons-material`.
- [components-vs-containers.instructions.md](components-vs-containers.instructions.md) — icons are assets, not components; they get their own folder.

**No icon library.** The repo does **not** use `@mui/icons-material`, `react-icons`, `lucide-react`, `heroicons`, or Font Awesome. Every icon is an inline SVG wrapped as a React component under `@icons/*`.

---

## Folder layout

```
icons/
  IIcon.ts                 <-- shared props interface, .ts (no JSX)
  <IconName>.tsx           <-- one file per icon, PascalCase, default export
```

The shared props contract lives in `IIcon.ts`, alongside every icon file.

Rules:
- **Flat folder.** No subfolders per icon or per category.
- **File name = component name** (PascalCase, `.tsx`). Default export. See [typescript.instructions.md](typescript.instructions.md#exports).
- **`IIcon.ts` is `.ts`**, not `.tsx` — no JSX in the shared props file.
- **Path alias `@icons`** — import as `import CaretIcon from "@icons/CaretIcon";`. Never relative.
- **No barrel `index.ts`.** Consumers import each icon by name.
- **Naming convention:** describe the shape or action, PascalCase. Follow the source's suffix if there's a variant family (`Rounded`, `Outlined`, `Sharp`, `Filled`). Examples: `AddRounded`, `ExternalLinkOutlined`, `CookieIcon`.

---

## The `IIcon` contract

Every icon accepts **exactly** the shared `IIcon` interface — no more, no less:

```ts
export default interface IIcon {
  className?: string;
  color?: string;
  width?: number;
  height?: number;
  alt?: string;
}
```

Rules:
- **Never add per-icon props** by extending `IIcon` for one file. If a single icon truly needs an extra input (e.g., an animation toggle), define a local interface in that `.tsx` and don't touch `IIcon.ts`.
- **Never widen `IIcon`** with fields that most icons will ignore. The interface is the contract every consumer relies on.
- **`color?: string` is currently unused** by the existing icons — theming happens through `sx` (see below). New icons that genuinely need runtime color overrides can wire it, falling back to a theme token. Do not remove the field.

---

## The icon template

Copy this shape verbatim. Only three things change per icon: the name, the `viewBox` / defaults, and the `<path>` data.

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

Rules (in order):

1. **Import `IIcon` from `./IIcon`** — the one relative import allowed inside `@icons/*`, because it's a sibling file. Anywhere else, use `@icons/...`.
2. **`function <Name>({ … }: IIcon)`** with defaults destructured inline. No separate `defaultProps`.
3. **Defaults:**
   - `width` and `height` default to the SVG's natural `viewBox` size (typically `24`). Never mix — `width = 24` with `height = 18` distorts.
   - `alt` defaults to a human-readable version of the component name (`"Add Rounded"`, not `"AddRounded"` or `"add-rounded"`). Consumers can override with a domain-specific label.
   - `className` and `color` do **not** get defaults.
4. **`<svg>` attributes in this exact order:** `className`, `width`, `height`, `viewBox`, `fill="none"`, `xmlns="http://www.w3.org/2000/svg"`.
   - `fill="none"` sits on the `<svg>` so per-path `fill` (via `sx`) wins. Do not add `fill="currentColor"` — the repo doesn't rely on CSS `color` inheritance.
   - Keep the `xmlns` attribute even though React strips it in some places; it's expected by tooling and consistent with the codebase.
5. **`<title>{alt}</title>` is always the first child of `<svg>`.** Non-negotiable — it's the accessible name for screen readers. Skipping it breaks a11y and lint expectations.
6. **Color is set on each `<path>` via `sx`**, callback form only, always via a theme token. See [styling.instructions.md](styling.instructions.md#the-sx-prop-escape-hatch-with-rules).
   - `sx={(theme) => ({ fill: theme.palette.<slot> })}` — never `fill="#123456"`, never `fill="white"`.
   - If several `<path>`s share the same fill, repeat the `sx` block on each. **Do not** hoist to the `<svg>` unless the whole graphic is monochrome and every child inherits (see the monochrome shortcut below).
7. **Palette tokens actually used today:**
   - `theme.palette.common.white` — icons rendered on colored buttons.
   - `theme.palette.grey[800]` — neutral UI chrome.
   - `theme.palette.primary.main` — brand-colored accents.
   - Pick from these first. Only introduce a new token when no existing one fits.

### Monochrome shortcut — fill on `<svg>`

When every shape in the icon shares one color, put `sx` on the `<svg>` and drop it from each `<path>`.

```tsx
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
```

Rules:
- **Drop `fill="none"` from the `<svg>`** when using this pattern — the `sx` fill needs to reach the children.
- **Do not mix** per-`<path>` `sx` with an `<svg>`-level `sx` fill in the same icon. Pick one.

### Multi-color icons

Wire the fill on each `<path>` / `<circle>` / `<rect>` individually, one `sx` block per element. This gives you a per-shape color even inside a single icon.

---

## Sizing and non-24 icons

Not every icon is 24×24. Set the defaults so `width` and `height` match the SVG's `viewBox` exactly — e.g. `viewBox="0 0 16 16"` → `width = 16, height = 16`.

Rules:
- **Never scale a non-24 icon by passing `width={24}`** at the call site — the aspect ratio distorts. Create a new sized variant (`<IconName>Large`) or ask the designer for the correct source.
- **Prefer sizing via the `width` / `height` props**, not via CSS `transform: scale(...)`. Scaling blurs SVGs on some browsers.
- For spacing around the icon, use utility classes on the icon element itself (`className="mr-xs"` next to a label), not width/height changes. See [styling.instructions.md](styling.instructions.md#utility-classes-the-first-stop).

---

## Consuming icons

Common patterns:

```tsx
// Icon next to a button label
<Button variant="contained" onClick={onLogout}>
  <LogoutRounded className="mr-xs" />
  <Typography variant="button">{t("home__logout")}</Typography>
</Button>

// Icon as an accordion expand indicator
<CaretIcon />

// Decorative icon inside a banner
<CookieIcon className="mr-md" />
```

Rules:
- **`className` carries spacing**, not size. Size overrides are rare and always require both `width` and `height`.
- **Set a domain-specific `alt`** when the icon is the only affordance in a control (e.g., an icon-only button). When the icon is decorative next to labeled text, the default `alt` is fine.
- **Do not wrap icons in `<span>` or `<div>` for styling.** Put utility classes directly on the icon.
- **Icons live inside interactive elements (`Button`, `IconButton`), not the other way around.** See [mui-and-uikit.instructions.md](mui-and-uikit.instructions.md) for the wrapper components.

---

## Adding a new icon — checklist

1. Get the SVG source (Figma export, design system, third-party asset). Confirm the `viewBox` and that it's a **single-color monochrome** unless the design truly requires multi-fill.
2. Run it through an SVG optimizer (SVGO or equivalent) — keep only `<path>` / basic shape elements, the `viewBox`, and geometry attributes. Strip `id`, `class`, `style`, inline `fill` / `stroke`, `stroke-width` unless meaningful, `data-*`.
3. Copy the appropriate template above (monochrome shortcut or per-path multi-color) and adapt.
4. Rename the file and the component. `alt` default is a spaced version of the name.
5. Wire the fill via `sx` callback → theme token. Do not paste raw hex.
6. Import from `@icons/<Name>` at the call site.

---

## Common mistakes and how to fix them

### 1. Hardcoded fill

```tsx
// Bad
<path d="…" fill="#4A6DE5" />
```

```tsx
// Good — theme-driven, dark-mode-friendly
<path
  d="…"
  sx={(theme) => ({ fill: theme.palette.primary.main })}
/>
```

### 2. Missing `<title>`

```tsx
// Bad — no accessible name
<svg …>
  <path … />
</svg>
```

```tsx
// Good
<svg …>
  <title>{alt}</title>
  <path … />
</svg>
```

### 3. Distorted resize

```tsx
// Bad — 16×16 icon forced to 24 wide, keeps 16 tall → squashed
<ExternalLinkOutlined width={24} />
```

```tsx
// Good — both dimensions, matched proportions
<ExternalLinkOutlined width={24} height={24} />
```

### 4. Growing `IIcon` for a single case

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
export default function SpinnerIcon({ spinning, …rest }: ISpinnerIcon) { … }
```

### 5. Pulling from `@mui/icons-material`

```tsx
// Bad — pulls in a new dependency, bypasses the theming pipeline
import AddIcon from "@mui/icons-material/Add";
```

```tsx
// Good — wrap the SVG once, reuse everywhere
import AddRounded from "@icons/AddRounded";
```

### 6. Sizing with CSS `transform`

```tsx
// Bad — blurry on subpixel scales, and utility classes aren't for this
<CaretIcon className="scale-150" />
```

```tsx
// Good
<CaretIcon width={36} height={36} />
```

### 7. Wrapping icons in a `<div>` for spacing

```tsx
// Bad
<div className="mr-xs"><LogoutRounded /></div>
```

```tsx
// Good
<LogoutRounded className="mr-xs" />
```

### 8. `fill="currentColor"` and inherited CSS color

```tsx
// Bad — the repo doesn't rely on CSS color inheritance for icons
<svg fill="currentColor">…</svg>
```

Use `sx` + theme token instead. It's a single source of truth and works with Pigment-CSS statically.

---

## Not currently registered in the UiKit page

Icons are treated as **assets**, not UI components, and are **not** registered in `@pages/uikit` today. The rule from [mui-and-uikit.instructions.md](mui-and-uikit.instructions.md#registering-a-new-component-in-the-uikit-page) applies to interactive components, not to icons. If the design system evolves to expose an icon swatch page, add one `UikitBlock` per icon there — do not scatter icon showcases across other pages.

---

## Things to avoid

- Adding an icon-library dependency (`@mui/icons-material`, `react-icons`, `lucide-react`, `heroicons`, Font Awesome).
- Barrel exports from `@icons`.
- Extending `IIcon` for one-off props.
- Hardcoded fills (hex, named color, `currentColor`).
- Missing `<title>`.
- Mismatched `width` / `height` for non-square icons.
- Sizing via CSS `transform: scale(...)`.
- Wrapping icons in extra elements for spacing.
- Mixing `<svg>`-level and `<path>`-level `sx` fills in the same icon.
- Emojis in place of icons.
- Inline `<style>` blocks or `<defs>` with gradients unless the design absolutely requires it — flag it and confirm with a designer first.
- Multi-file icon "components" (a folder with `index.tsx` + `Icon.tsx`). One file per icon.

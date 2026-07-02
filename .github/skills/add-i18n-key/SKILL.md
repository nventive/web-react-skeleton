---
name: add-i18n-key
description: "Add or change a translation key in the web-react-skeleton React SPA. Use when: adding a translation, adding an i18n key, translating user-facing text, editing en.json / fr.json, adding a validation message, adding a toast/error copy, adding a route path in another language, adding a page title, adding plurals, adding interpolation, or running yarn sheet2i18n. Enforces the sheet2i18n workflow (never hand-edit locale JSONs — edit the Google Sheet, run yarn sheet2i18n, commit regenerated JSONs), the <namespace>__<snake_case_name> key convention, reserved keys (locale__key, routes__<page>, <page>__page_title), interpolation with {{ name }}, plurals via count, and the translate-in-parent / string-down rule."
argument-hint: "<key or feature> — e.g. 'register__sign_up' or 'sign-up button on the register page'"
---

# Add / Change an i18n Key

Add a new translation key (or change an existing one) in the web-react-skeleton frontend, following the Google Sheet → `yarn sheet2i18n` → generated JSON pipeline. The locale JSONs are **generated**, not edited.

## When to Use

- User asks to "add a translation", "translate this text", "add an i18n key", "add a copy string", "add a validation message", "add an error toast", or "add a page title".
- User asks to add a route path in another language (`routes__<page>` key).
- User asks to add plurals or an interpolated string (`{{ name }}`).
- User asks to sync locales, regenerate JSONs, or run `yarn sheet2i18n`.
- User is about to render a hard-coded English string in JSX.
- User has just opened `frontend/src/assets/locales/en.json` or `fr.json` to edit it.

Do **not** use this skill for:
- Wiring `useTranslation` in a new component with keys that already exist (just call `t("existing_key")`).
- Adding a whole new language (that's a bigger recipe — see [i18n.instructions.md](../../instructions/i18n.instructions.md#adding-a-new-locale)).
- Reordering keys or reformatting the JSONs — those changes are lost on the next regeneration.

## The One Rule That Trumps Everything

**Never hand-edit `frontend/src/assets/locales/en.json` or `fr.json`.** They are regenerated from a Google Sheet by `yarn sheet2i18n`. Any manual edit is silently overwritten on the next sync — the string ships once, then vanishes.

If the user starts editing a locale JSON directly, **stop them** and redirect to the Sheet workflow below.

## Inputs to Confirm

Before doing anything, confirm with the user (ask only what's missing):

1. **What the user-facing text is**, in the source language (usually English). E.g. `"Sign up"`.
2. **The other language(s)** — for this repo, French. If unknown, ask; do not machine-translate silently in the code path.
3. **Where the key will be consumed** — page name, component, form, toast, route path, page title. This picks the namespace.
4. **Whether the key needs interpolation** (`{{ name }}`, `{{ min }}`, etc.) and the placeholder names.
5. **Whether the key needs plurals** — is `count` variable? If yes, both the base and `_other` (and `_zero` / `_few` / `_many` for other languages) forms are needed.
6. **Whether an existing key already covers it** — always check `frontend/src/assets/locales/en.json` before proposing a new key. Reuse `errors__generic`, `validations__required`, `global__close`, etc.

## The Workflow (Ground Truth)

```
Google Sheet (source of truth)
      │
      │  yarn sheet2i18n   (from frontend/)
      ▼
frontend/src/assets/locales/en.json + fr.json   (generated — do not edit)
      │
      │  imported by @shared/i18n
      ▼
t("<namespace>__<name>")  in components / forms / toasts
```

**Every new / changed translation lives first in the Sheet.** Code and JSON follow.

## Procedure

Follow every step in order.

### 1. Check if the key already exists

Search `frontend/src/assets/locales/en.json` for an existing key before proposing a new one. Common reusable keys:

| Key | Use for |
|---|---|
| `global__close`, `global__hide`, `global__clipboard_copy` | Generic UI actions. |
| `errors__generic` | Any unclassified failure toast. |
| `errors__invalid_credentials`, `errors__expired_session` | Existing auth errors. |
| `validations__required` | Any required field. |
| `validations__min_characters`, `validations__max_characters` | Length validators (interpolates `{{ min }}` / `{{ max }}`). |
| `locale__key`, `locale__switch_key`, `locale__switch` | Language switching — **never** create new variants of these. |

If a suitable key exists → skip the Sheet edit, use the existing key in code, done.

### 2. Pick the namespace

Every key is `<namespace>__<snake_case_name>` — **double underscore** between namespace and name. The namespace matches a **Sheet tab**. Current tabs (see `frontend/src/sheet2i18n.config.cjs`):

| Sheet tab / Namespace | Use for | Examples |
|---|---|---|
| `global` (Global tab) | App-wide UI text used on more than one page. | `global__close`, `global__hide` |
| `components` (Components tab) | Copy owned by a shared `@components/*` or `@containers/*` (e.g. cookie banner). | `cookie_banner__accept_all`, `cookie_modal__title` |
| `routes` (Routes tab) | Localized URL segments + the shared page-title suffix. | `routes__login`, `routes__home`, `routes__page_title` |
| `validations` (Validations tab) | Yup validation messages, with `{{ field }}` / `{{ min }}` / `{{ max }}` interpolation. | `validations__required`, `validations__max_characters` |
| `errors` (Errors tab) | User-facing error copy (used with `toast.error`). | `errors__generic`, `errors__invalid_credentials` |
| `<page>` (one tab per page: Home, Login, Uikit, …) | Copy scoped to a single page. Namespace = page folder name. | `home__welcome`, `login__sign_in`, `dashboard__page_title` |

Decision rules:

- **Used on one page** → page namespace (`home__…`, `login__…`).
- **Used across pages** → `global__…`.
- **Owned by a shared component/container** → `components` tab with a `<component>__…` namespace (e.g. `cookie_banner__…`).
- **Yup validation message** → always `validations__…`.
- **Toast/error copy** → always `errors__…`.
- **Localized URL segment** → always `routes__<page>` (the value is the URL slug for that language).
- **Page title (browser tab)** → always `<page>__page_title` (consumed by `Router.tsx`).

If the target page has no Sheet tab yet, tell the user — a new tab plus a new URL entry in `sheet2i18n.config.cjs` are required before regeneration will pick it up.

### 3. Pick the key name

- Lowercase, `snake_case` after the namespace: `home__welcome`, not `home__Welcome` or `home__welcomeMessage`.
- Descriptive of the meaning, not the location — `register__sign_up` (button meaning), not `register__button_1`.
- Field labels: `<page>__<field>` (e.g. `register__email`). The namespace matches the **page** that hosts the form, not the form itself.
- For plurals, name the singular normally and add `_other` (and `_zero` / `_few` / `_many` if needed) siblings: `asset__share_modal_title` + `asset__share_modal_title_other`.
- For interpolation, name matches the object key you'll pass in code — case-sensitive, spaces required around the placeholder: `"{{ field }} is required."`.

### 4. Reserved keys — never rename or remove

Do not rename or remove any of these — they are consumed by the router / language switch / page-title logic and renaming them breaks the app:

| Key | Consumed by | Effect if broken |
|---|---|---|
| `locale` | Human-readable language label. | UI display only. |
| `locale__key` | Every `route.paths[t("locale__key")]` call, `Router.tsx`, `<Helmet htmlAttributes>`. | Breaks all localized navigation. |
| `locale__switch` | Label on the language toggle. | UI display only. |
| `locale__switch_key` | `findRoute(...)` + `i18n.changeLanguage(...)` on language switch. | Breaks language switch. |
| `routes__<page>` | Every `<page>.route.tsx` builds its URL from this. | URL 404s after regeneration. |
| `<page>__page_title` | `Router.tsx` sets the tab title from this. | Tab title falls back to the raw key. |
| `routes__page_title` | Global app title suffix in the tab. | Tab title reads as raw key. |

If a rename is genuinely required, do it in the Sheet, regenerate, and update every code site in the same commit.

### 5. Tell the user exactly what to add to the Sheet

Do not just say "add it to the Sheet." Produce a concrete instruction listing:

- **Tab name** (from step 2).
- **Key** (from step 3).
- **English value**.
- **French value** (or ask the user).
- For plurals: the base row **and** the `_other` row.
- For interpolation: the exact `{{ name }}` placeholders as they appear in the value.

Example message to the user:

> Add the following rows to the Google Sheet (tab **Login**):
> | key | en | fr |
> |---|---|---|
> | `register__email` | Email address | Adresse e-mail |
> | `register__password` | Password | Mot de passe |
> | `register__sign_up` | Sign up | S'inscrire |
>
> Then run `yarn sheet2i18n` from `frontend/`.

If the user cannot update the Sheet right now, offer two options:

- **(a) Pause** the code change until keys land. Preferred when the target key is required for compilation (`routes__<page>`, `<page>__page_title`).
- **(b) Proceed** with the intended key names — the app will render the raw key string (i18next `returnNull: false`) until the JSONs regenerate. Acceptable for body copy, not for reserved keys.

**Never** hand-edit `en.json` / `fr.json` as a workaround.

### 6. Run `yarn sheet2i18n`

Once the Sheet has been updated, run from `frontend/`:

```sh
yarn sheet2i18n
```

Expected result: `frontend/src/assets/locales/en.json` and `fr.json` are updated in place. Diff them to confirm the new key is present in both locales with the expected values.

If the diff shows an unexpected removal or reordering, do **not** revert manually — check the Sheet for a row that was deleted or moved. The generator's output is a mirror of the Sheet.

### 7. Use the key in code

Consumption patterns depend on where the key lands. Pick the matching one.

#### 7a. In a component (default case)

```tsx
import { useTranslation } from "react-i18next";

function Home() {
  const { t } = useTranslation();
  return <Typography variant="h4">{t("home__welcome")}</Typography>;
}
```

Rules:

- Import `useTranslation` **from `react-i18next`**, never from `i18next`.
- Call `t()` at render time. Never at module scope, class field, or store default.
- **Translate in the parent, pass a string to the child.** A child receives `children: ReactNode` or a `label: string` — never a `labelKey`. The only exception is a wrapper whose entire job is to look up a key by construction (e.g. `FieldHelperText`).
- No half-sentence concatenation (`t("common__hello") + " " + name`) — use interpolation instead.

#### 7b. With interpolation

Sheet value: `"{{ field }} is required."` (mind the spaces).

```tsx
t("validations__required", { field: t("register__email") });
```

- Placeholder names in the value are **case-sensitive** and include surrounding spaces (`{{ name }}`, not `{{name}}`).
- Values passed in can be already-translated strings, formatted numbers/currencies (`dayjs`, `formatCurrency`), or raw numbers/booleans.
- **Never** pass raw HTML — React escapes it. If you need markup, split the string and compose in JSX.
- For "field name inside a sentence" (Yup / FieldHelperText), translate the label key first, then pass the translated string as the placeholder.

#### 7c. With plurals

```tsx
t("asset__share_modal_title", { count: assets.length });
```

- Do not branch with `assets.length === 1 ? t(...) : t("..._other")`. Use `count`.
- Add the `_other` (and `_zero` / `_few` / `_many` if the target language needs it) rows in the Sheet alongside the base — the generator produces the sibling keys.

#### 7d. In a toast

```tsx
toast.error(t("errors__invalid_credentials"), { toastId: "invalid-credentials" });
toast.error(t("errors__generic"),            { toastId: "generic" });
```

- Always pass a **stable `toastId`** (a slug matching the key name minus the namespace is a fine default). Without it, a burst of failed requests stacks N identical toasts.
- Reuse `errors__generic` for unclassified failures. Add a new `errors__…` key only when the copy is genuinely distinct.

#### 7e. In a Yup schema (validation)

Validation messages **must** be `validations__*` keys — `FieldHelperText` translates them by looking up the key and interpolating the field label:

```ts
import { object, string } from "yup";

const registerSchema = object({
  email: string()
    .label("register__email")                    // label = i18n key, NOT human text
    .required("validations__required")           // message = i18n key
    .email("validations__invalid_email"),
});

export default registerSchema;
```

- `.label(...)` receives the i18n key of the field name. `FieldHelperText` translates it into `{{ field }}`.
- Every validator that can fail carries a `validations__*` message key. No `.required()` without an argument.
- Never inline plain-English validation strings — the message goes through `t()` inside `FieldHelperText`.

#### 7f. As a localized route path

`routes__<page>` values are URL slugs (one per language). Each `<page>.route.tsx` reads them by importing the locale JSONs directly (**not** via `t()` — the router runs before the React tree mounts):

```tsx
// dashboard.route.tsx
import en from "@assets/locales/en.json";
import fr from "@assets/locales/fr.json";
import { IRoute } from "@routes/interfaces/IRoute";
import { lazy } from "react";

const dashboardRoute: IRoute = {
  name: "dashboard__page_title",
  component: lazy(() => import("./withAuthDashboard")),
  paths: {
    en: `/${en.locale__key}/${en.routes__dashboard}`,
    fr: `/${fr.locale__key}/${fr.routes__dashboard}`,
  },
};

export default dashboardRoute;
```

Adding a new page → add the matching `routes__<page>` row in the Sheet **before** the route file references it, otherwise `en.routes__dashboard` is `undefined` and TypeScript fails the build. `name` is the raw i18n key string — `Router.tsx` calls `t()` on it at render time.

#### 7g. As a page title

Add `<page>__page_title` in the Sheet and set it as the `name` field of the route (see 7f). `Router.tsx` translates it for the browser tab title (suffixed with `routes__page_title`).

### 8. Verify

From `frontend/`:

1. **Confirm the keys are in both JSONs** — grep the new key in `assets/locales/en.json` and `fr.json`.
2. **`yarn lint:scripts`** — catches typos in `t("…")` only if the key is referenced via a const; freeform strings pass. Do not rely on it for i18n coverage.
3. **`yarn build`** — full type check. Missing `routes__<page>` or `<page>__page_title` keys still build (i18next returns the raw key) but produce visible bugs; walk the affected pages.
4. **`yarn dev`** — render the page in both languages:
   - Switch languages via the toggle. The new text updates in place.
   - Placeholders (`{{ name }}`) render substituted, not literal.
   - Plurals switch between singular / `_other` as `count` changes.
   - No key string leaks into the UI (a visible `home__welcome` means the JSON regeneration was skipped).
5. **Commit the regenerated JSONs together with the code change** — never in a separate PR. Reviewers rely on the JSON diff to see what strings were added.

## Completion Checklist

Before reporting done, verify all apply:

- [ ] The key is present in `frontend/src/assets/locales/en.json` **and** `fr.json`, with the expected values.
- [ ] The JSONs were regenerated via `yarn sheet2i18n` — no hand edits.
- [ ] Key follows `<namespace>__<snake_case_name>`; namespace matches a Sheet tab.
- [ ] Reserved keys were not renamed or removed.
- [ ] Interpolation placeholders in the value match the keys passed in `t(key, { … })`, spaces and case included.
- [ ] Plurals use `count`, with sibling `_other` (and `_zero` / `_few` / `_many` as needed) in the Sheet.
- [ ] Toasts pass a stable `toastId`.
- [ ] Validation messages use `validations__*` keys, and `.label(...)` in the Yup schema is a key (not human text).
- [ ] Components call `t()` at render time; children receive translated strings, not keys.
- [ ] The regenerated JSONs are staged in the same commit as the code that uses the new keys.
- [ ] The page renders correctly in both `en` and `fr` after a language switch.

## Anti-patterns to Reject

- Hand-editing `frontend/src/assets/locales/en.json` or `fr.json` — regenerate via `yarn sheet2i18n`.
- Adding a key in code that doesn't yet exist in the JSON without telling the user. It falls back to the raw key string and ships unnoticed.
- Renaming or removing `locale__key`, `locale__switch_key`, `routes__<page>`, `<page>__page_title`, or `routes__page_title` without updating every consumer in the same commit.
- Machine-translating French inline in code as a fallback. Route through the Sheet.
- Concatenating translated fragments (`t("hello") + " " + name`) — use `{{ name }}`.
- Conditional `t()` for plurals (`count === 1 ? t(...) : t("..._other")`) — use `count`.
- `.replace("{name}", value)` on a translated string — use i18next interpolation.
- Storing `t("…")` at module scope, class field, or store default — it runs before i18next initializes.
- Translating twice: `t(t("foo"))`. The child was handed a key when it should have been handed a string.
- Passing `labelKey` / `translationKey` props to a child component — parent translates, child receives a string.
- `toast.error(t("errors__…"))` without a `toastId` — duplicate toasts stack.
- Yup `.label("Email address")` or `.required("Required")` — labels and messages must be i18n keys, not human strings.
- Reading the current locale from `navigator.language`, `location.pathname.split("/")[1]`, or a store field — use `t("locale__key")`.
- Adding a namespace prefix in the call (`t("common:hello")`) — the app uses a single default namespace.
- HTML in a translation value — split the string and compose in JSX.
- Bypassing `i18n.changeLanguage` on language switch (only editing the URL) — the runtime language stays stale.
- Committing code that uses a new key without the regenerated JSONs — reviewers can't verify the copy.

## References

- [i18n.instructions.md](../../instructions/i18n.instructions.md) — the full rules this skill enforces.
- [routing-and-auth.instructions.md](../../instructions/routing-and-auth.instructions.md) — how `locale__key`, `locale__switch_key`, and `routes__<page>` power localized URLs; `findRoute` for language switching.
- [forms.instructions.md](../../instructions/forms.instructions.md) — how Yup validation keys map through `FieldHelperText`.
- [services-api.instructions.md](../../instructions/services-api.instructions.md) — `toast.error(t("errors__…"))` with stable `toastId`.
- [react.instructions.md](../../instructions/react.instructions.md) — the "translate in parent, pass a string down" rule.
- `add-form`, `add-page`, `add-service` skills — all three depend on this workflow when they introduce new user-facing text.

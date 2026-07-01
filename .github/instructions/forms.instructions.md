---
description: Form conventions — folder layout, Yup schemas, controlled state, submit + blur validation, and FieldHelperText wiring.
applyTo: "frontend/src/app/forms/**/*.{ts,tsx}"
---

# Forms

Scope: everything under `@forms/*` — the form component and its Yup schema. Forms are their own folder alongside `@components` / `@containers` because they combine both concerns (state + orchestration + presentational children).

Complementary files (do not repeat their content here):
- [react.instructions.md](react.instructions.md) — component shape, hooks, `Dispatch<SetStateAction>` prop typing. This file expands the "Forms" section there.
- [services-api.instructions.md](services-api.instructions.md) — the `.then / .catch / .finally` service call pattern and `toast.error` conventions used in `onSubmit`.
- [i18n.instructions.md](i18n.instructions.md) — `validations__*` namespace, why every schema label / message is an i18n key.
- [typescript.instructions.md](typescript.instructions.md) — `I` prefix for props, file naming.
- [components-vs-containers.instructions.md](components-vs-containers.instructions.md) — how forms differ from containers.

Validation library: `yup` v1. Form UI primitives come from `@components/*` (`TextField`, `Button`, `FieldHelperText`).

---

## Folder layout

```
forms/
  <domain>/                          <-- feature grouping (auth, project, cart, …)
    <formName>/                      <-- one folder per form, camelCase
      <FormName>.tsx                 <-- default export, PascalCase file name
      <formName>.schema.ts           <-- default export schema, camelCase file name
```

Rules:
- **One folder per form**, even if it holds just two files. Never colocate multiple forms in the same folder.
- **File name = default export name** (see [typescript.instructions.md](typescript.instructions.md#naming-conventions)). Form component in PascalCase; schema file in camelCase.
- **Schema always in `<formName>.schema.ts`**, next to the component. Never inside the `.tsx`.
- **No `interfaces/` subfolder** for form-local props — inline the `I<FormName>` interface at the top of the `.tsx`. Domain models (like `ILogin`) belong under the owning service (see [services-api.instructions.md](services-api.instructions.md)).

---

## The schema file

Yup schemas are small, declarative, and use i18n keys for everything a user might see:

```ts
import { object, string } from "yup";

const loginFormSchema = object({
  username: string().label("login__username").required("validations__required"),
  password: string()
    .label("login__password")
    .min(8, "validations__min_characters"),
});

export default loginFormSchema;
```

Rules:

1. **Named imports** from `yup` (`import { object, string, number, boolean, array, mixed, date, ref } from "yup"`). Never `import * as yup`.
2. **Default export** the schema constant, named `<formName>Schema`.
3. **`.label()` receives an i18n key**, not the human-readable label. `FieldHelperText` translates it and injects it as `{{ field }}` into the error string (see the nested-translation pattern in [i18n.instructions.md](i18n.instructions.md#nested-translation-for-label-fields)).
4. **Validation messages are `validations__*` i18n keys**. Never inline strings like `"Password is required"`. Reuse existing keys:
   - `validations__required`
   - `validations__min_characters` (interpolates `{{ min }}`)
   - `validations__max_characters` (interpolates `{{ max }}`)
   - Add a new key via `sheet2i18n` if a genuinely new message is needed.
5. **Field names match the state shape** exactly. `FieldHelperText` matches on `error.path === fieldNames`, so a mismatch silently hides errors.
6. **No `.oneOf([true])` / `.matches(...)` without a message key.** Every validator that can fail carries an i18n key as its message argument.
7. **No `.transform` for i18n** — keep the schema pure validation. Formatting belongs in the component.

### Cross-field validation

Use `ref` from yup for comparisons and pass the same key convention:

```ts
import { object, ref, string } from "yup";

const registerFormSchema = object({
  password: string().label("register__password").required("validations__required"),
  passwordConfirm: string()
    .label("register__password_confirm")
    .oneOf([ref("password")], "validations__passwords_must_match"),
});
```

If `validations__passwords_must_match` isn't in the Sheet yet, add it there **first** — do not hand-edit the locale JSON (see [i18n.instructions.md](i18n.instructions.md#the-one-rule-that-trumps-everything)).

---

## The form component

Every form follows the same shape.

### Props

- Interface `I<FormName>` at the top of the file, non-exported.
- **Loading is owned by the parent.** A form takes `setIsLoading: Dispatch<SetStateAction<boolean>>` and flips it around the async submit. The parent page renders `<Loading isLoading={isLoading} />` — the form does not.
- Do not accept an `onSubmit` prop that abstracts the service call. Forms are tightly bound to one service call; keep the call inside the form.
- Do accept callbacks for cross-cutting parent concerns (e.g., `onSuccess?: () => void`) if the parent needs to react beyond the built-in navigation/toast.

```tsx
interface ILoginForm {
  setIsLoading: Dispatch<SetStateAction<boolean>>;
}

export default function LoginForm({ setIsLoading }: ILoginForm) { /* ... */ }
```

### State — three pieces, in this order

```tsx
const [loginForm, setLoginForm] = useState<ILogin>({
  username: "",
  password: "",
});
const [loginFormValidated, setLoginFormValidated] = useState<boolean>(false);
const [formErrors, setFormErrors] = useState<ValidationError[]>([]);
```

- **Values as a single object** typed against the request interface from the owning service (`ILogin` here). Never one `useState` per field.
- **`<name>Validated` boolean** — flipped to `true` on first submit; gates re-validation on blur so the user isn't yelled at while typing the first time.
- **`formErrors: ValidationError[]`** from Yup's `error.inner`. Do not flatten to strings; `FieldHelperText` needs the full `ValidationError` shape.

### `onSubmit` template

```tsx
const onSubmit = useCallback(
  (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      setLoginFormValidated(true);
      loginFormSchema.validateSync(loginForm, { abortEarly: false });
      setFormErrors([]);
      setIsLoading(true);
      postLogin(loginForm)
        .then(({ data }) => {
          // success side effects — tokens, store, navigate
        })
        .catch((error) => {
          if (error.response?.data?.message === "Invalid credentials") {
            toast.error(t("errors__invalid_credentials"), { toastId: "invalid-credentials" });
          } else {
            toast.error(t("errors__generic"), { toastId: "generic" });
          }
        })
        .finally(() => {
          setIsLoading(false);
        });
    } catch (error) {
      if (error instanceof ValidationError) {
        setFormErrors(error.inner);
      }
    }
  },
  [loginForm, /* ...other deps used in the body */],
);
```

Rules:
- **`event.preventDefault()` first** — always.
- **`setLoginFormValidated(true)` before `validateSync`** — so subsequent blur re-validation is enabled.
- **`validateSync(values, { abortEarly: false })`** — collect all errors, not just the first. Wrap in `try/catch` because it throws on failure.
- **Clear `formErrors` on validation success**, before the async call. Stale errors must not linger past a valid submit.
- **Only call the service after validation passes.** The service call is inside the `try` block so failed validation short-circuits.
- **Service call follows [services-api.instructions.md](services-api.instructions.md#where-services-get-called)** — `.then` with destructured `{ data }`, `.catch` with known errors first + `errors__generic` fallback, `.finally` to reset loading.
- **The `catch (error)` at the outer `try` handles Yup errors only** — `error instanceof ValidationError` guard, then `setFormErrors(error.inner)`. Do not toast validation errors; they render inline via `FieldHelperText`.

### `onValidate` for `onBlur`

Re-runs the schema silently once the user has attempted a submit. Prevents a fixed field from staying red until the next submit.

```tsx
const onValidate = useCallback(() => {
  try {
    if (loginFormValidated) {
      loginFormSchema.validateSync(loginForm, { abortEarly: false });
      setFormErrors([]);
    }
  } catch (error) {
    if (error instanceof ValidationError) {
      setFormErrors(error.inner);
    }
  }
}, [loginForm, loginFormValidated]);
```

Rules:
- **Guarded by the `<name>Validated` flag** — do nothing if the user hasn't tried to submit yet.
- **Wired to every field's `onBlur`**, not `onChange` (avoid re-validating on every keystroke).

### JSX layout

Each field is a `<div className="mb-md">` wrapping the input **and** its `FieldHelperText`. Submit is a `Button type="submit"`.

```tsx
return (
  <form className="flex-column" onSubmit={onSubmit}>
    <div className="mb-md">
      <TextField
        autoFocus
        fullWidth
        onBlur={onValidate}
        autoComplete="username"
        value={loginForm.username}
        onChange={(value) =>
          setLoginForm((prevState) => ({ ...prevState, username: value }))
        }
        label={t("login__username")}
      />
      <FieldHelperText fieldNames="username" formErrors={formErrors} />
    </div>

    <div className="mb-md">
      <TextField
        fullWidth
        onBlur={onValidate}
        autoComplete="current-password"
        type="password"
        value={loginForm.password}
        onChange={(value) =>
          setLoginForm((prevState) => ({ ...prevState, password: value }))
        }
        label={t("login__password")}
      />
      <FieldHelperText fieldNames="password" formErrors={formErrors} />
    </div>

    <Button className="mb-md" variant="contained" size="large" type="submit">
      {t("login__sign_in")}
    </Button>
  </form>
);
```

Rules:
- **Native `<form onSubmit>`** — never `onClick` on the submit button. Preserves keyboard `Enter` submission.
- **`TextField.onChange` receives `value: string`** — the repo's `TextField` wrapper converts the event for you (see [mui-and-uikit.instructions.md](mui-and-uikit.instructions.md#the-wrapper-pattern)).
- **State updates use the functional form**: `setLoginForm((prevState) => ({ ...prevState, field: value }))`.
- **`autoComplete` attributes** on relevant inputs (`username`, `current-password`, `new-password`, `email`, `given-name`, `family-name`, `postal-code`, `off`). Password managers need them; do not omit.
- **Labels translated at the call site**: `label={t("login__username")}` — the child gets a string, not a key (see [i18n.instructions.md](i18n.instructions.md#the-translate-in-parent-pass-a-string-down-rule)).
- **Spacing via utility classes** (`mb-md`, `flex-column`), never inline styles (see [styling.instructions.md](styling.instructions.md#utility-classes-the-first-stop)).

---

## `FieldHelperText` — the error/helper bridge

`FieldHelperText` from `@components/fieldHelperText` is the only component allowed to render Yup errors in a form. It handles:

- Matching `formErrors` on `path === fieldNames`.
- Translating `error.message` (a `validations__*` key) with the field's `label` (also a key) as the `{{ field }}` interpolation value.
- Falling back to `helperText` (already translated) when there is no error.

Contract:

```tsx
<FieldHelperText
  fieldNames="username"                           // or ["password", "passwordConfirm"] for grouped errors
  formErrors={formErrors}                         // straight from useState
  helperText={t("login__password_hint")}          // optional, shown only when no error
/>
```

Rules:
- **`fieldNames` must match the schema field name** exactly. Typo → the error silently disappears.
- **`helperText` is pre-translated** by the caller. Do not pass a raw i18n key.
- **Do not render errors any other way** (no manual `.map(formErrors)`, no `<Typography color="error">`, no `alert`). All error UI goes through `FieldHelperText` so styling and animation stay consistent — the shared error component wraps each message in a fade transition.

---

## Loading UX — parent owns the overlay

The `<Loading />` component is a full-screen overlay. It belongs on the **page**, not inside the form.

```tsx
// parent page — owns the Loading overlay
const [isLoading, setIsLoading] = useState<boolean>(false);
return (
  <>
    <Loading isLoading={isLoading} />
    <Layout.Auth>
      {/* ... */}
      <LoginForm setIsLoading={setIsLoading} />
    </Layout.Auth>
  </>
);
```

Rationale:
- The overlay must sit above the form's parent layout, not inside it.
- Multiple sibling forms on one page share a single overlay.
- The form stays focused on inputs + validation + submit.

For inline "spinner in button" affordances (rarely needed today) use MUI's built-in button loading props rather than an overlay.

---

## Where forms sit vs. containers

A form is **more specific than a container**: it always represents one submit-to-service action. Rule of thumb:

- Has a schema + one primary submit? → `@forms/<domain>/<name>/`.
- Owns cross-page state or a subscription with no single submit? → `@containers/<name>/`.

Both are allowed to import from `@services`, `@stores`, `@routes`, etc. Both are called from pages (or from each other). See [components-vs-containers.instructions.md](components-vs-containers.instructions.md).

---

## Common mistakes and how to fix them

### 1. Inline validation message strings

```ts
// Bad — hardcoded, unlocalizable
username: string().required("Username is required"),
```

```ts
// Good
username: string().label("login__username").required("validations__required"),
```

### 2. Field-per-`useState`

```tsx
// Bad
const [username, setUsername] = useState("");
const [password, setPassword] = useState("");
// FieldHelperText won't get a schema-shaped object without extra plumbing
```

```tsx
// Good
const [loginForm, setLoginForm] = useState<ILogin>({ username: "", password: "" });
```

### 3. Submitting without the `<name>Validated` flag

Symptom: on-blur validation fires the moment the user tabs out of an empty field, before they've ever tried to submit. Fix: introduce the flag and gate `onValidate` on it (see the reference `onValidate`).

### 4. Toasting validation errors

```tsx
// Bad — validation errors belong inline
if (error instanceof ValidationError) {
  toast.error(t("errors__form_validation"));
}
```

```tsx
// Good — inline via FieldHelperText
if (error instanceof ValidationError) {
  setFormErrors(error.inner);
}
```

Reserve `errors__form_validation` for the (rare) case where the parent page needs a top-level warning — the form itself renders per-field.

### 5. Submit button `onClick` instead of form `onSubmit`

```tsx
// Bad — breaks Enter-key submit
<Button onClick={onSubmit}>Sign in</Button>
```

```tsx
// Good
<form onSubmit={onSubmit}>
  {/* ... */}
  <Button type="submit">Sign in</Button>
</form>
```

### 6. Form owning its own `Loading`

```tsx
// Bad — overlay renders under the layout, layered wrongly
return (
  <form>
    <Loading isLoading={isLoading} />
    {/* fields */}
  </form>
);
```

Hoist `isLoading` to the page and receive `setIsLoading` as a prop.

### 7. Skipping `abortEarly: false`

Without it, `validateSync` throws on the first failure — only one error surfaces at a time. Always pass `{ abortEarly: false }`.

---

## Things to avoid

- Inline schema definition inside the `.tsx`.
- Multiple `useState` per field.
- Inline validation messages (must be `validations__*` keys).
- `.label(t("..."))` — pass the raw key; `FieldHelperText` translates.
- Using anything other than `FieldHelperText` to render Yup errors.
- Submitting via a button `onClick` instead of `<form onSubmit>`.
- Rendering `<Loading />` inside a form.
- Introducing a form-management library (`react-hook-form`, `formik`, `final-form`) — the repo has one pattern.
- `async` `onSubmit` handlers — prefer explicit `.then/.catch/.finally` to match the codebase's service-call convention.
- Calling `schema.validate(...)` (async) instead of `validateSync` — the repo uses sync validation everywhere.
- Storing loading, error, or submit state on a Zustand store — form state stays local.
- Missing `autoComplete` on `<TextField>` for common fields.

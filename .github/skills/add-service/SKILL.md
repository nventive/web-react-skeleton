---
name: add-service
description: "Add a new Axios service to the web-react-skeleton React SPA. Use when: creating a new service, adding an API endpoint, wiring an HTTP call, adding a backend integration, defining a request/response interface, or scaffolding a folder under frontend/src/app/services/. Enforces the per-domain folder layout (<domain>Service.ts + interfaces/), shared axiosInstance, named async functions returning Promise<AxiosResponse<T>>, endpoint constants, CancelToken plumbing, and the no-try/catch-inside-services rule."
argument-hint: "<domain> <verb><Resource> — e.g. 'projects getProjects'"
---

# Add a Service

Add a new HTTP service under `frontend/src/app/services/<domain>/` following the project's `axiosInstance` + interfaces + call-site error handling conventions.

## When to Use

- User asks to "add a service", "add an API endpoint", "wire up a backend call", or "call an endpoint".
- User is about to build a form or container that needs a new HTTP request.
- User wants to add a new request/response interface under `services/*/interfaces/`.

Do **not** use this skill for:
- Adding a UI-only helper (that's a shared util or a component).
- Editing `axiosInstance.ts` itself (interceptors, baseURL, serializer) — that's infra, not a service call.
- Wrapping a service in try/catch — services stay uncaught; the caller handles errors.

## Inputs to Confirm

Before starting, confirm with the user (ask only what's missing):

1. **Domain** — the resource area (e.g. `auth`, `users`, `projects`). Names the folder and the endpoint prefix. Create the folder if it doesn't exist; reuse it if it does.
2. **Function(s) to add** — for each: HTTP verb, resource, and camelCase name. Name pattern is **verb + Resource** (`getMe`, `postLogin`, `getProjects`, `putProject`, `patchProject`, `deleteProject`).
3. **Endpoint path** — the URL after the domain prefix (e.g. `/login`, `/:id`, `/me/preferences`).
4. **Request shape** — for `POST`/`PUT`/`PATCH`: what the body looks like. If it needs a new interface, its name is `I<Something>` (e.g. `ILogin`, `ICreateProject`).
5. **Response shape** — the `I<Model>` returned. Reuse an existing interface when it applies (e.g. `IUser` for `getMe`).
6. **Path/query params** — any `:id` or query args, and whether they're required or optional.

If the user asked with just a name ("add a projects service to list projects"), infer verb + name (`getProjects`) and confirm assumptions in the summary.

## The Service Pattern (Ground Truth)

Every domain looks like this:

```
frontend/src/app/services/
├── axiosInstance.ts             # shared — do not duplicate
└── <domain>/
    ├── <domain>Service.ts       # named async function exports
    └── interfaces/
        ├── I<Request>.ts        # default export interface
        └── I<Response>.ts       # default export interface
```

Function shape (verbatim template):

```ts
const <DOMAIN>_PREFIX = "/<domain>";
const <VERB>_<RESOURCE> = `${<DOMAIN>_PREFIX}/<path>`;

export async function <verb><Resource>(
  <body>: I<Request>,          // for POST/PUT/PATCH
  <pathOrQuery>: string,       // additional args if needed
  cancelToken?: CancelToken,
): Promise<AxiosResponse<I<Response>>> {
  return await axiosInstance.<verb>(<ENDPOINT>, <body>, { cancelToken });
}
```

## Procedure

Follow every step in order. Do not skip.

### 1. Verify prerequisites and derive names

- Check whether `frontend/src/app/services/<domain>/` already exists. If it does, add to the existing `<domain>Service.ts` — do **not** create a second service file per domain.
- Derive names:
  - Folder: `services/<domain>/`
  - Service file: `<domain>Service.ts` (lowerCamelCase + `Service.ts`, e.g. `authService.ts`, `userService.ts`, `projectService.ts` — singular or plural follows the existing sibling files; when in doubt, singular).
  - Interface files: `I<Name>.ts` (PascalCase, one interface per file).
  - Endpoint prefix constant: `<DOMAIN>_PREFIX` in `SCREAMING_SNAKE_CASE`.
  - Endpoint constant: `<VERB>_<RESOURCE>` (e.g. `POST_LOGIN`, `GET_ME`, `GET_PROJECTS`, `PUT_PROJECT`).

### 2. Create/reuse interface files

Use [assets/IModel.ts.template](./assets/IModel.ts.template) for each new interface. One interface per file.

Rules (from [services-api.instructions.md](../../instructions/services-api.instructions.md)):

- File name is `I<Name>.ts`, PascalCase, matches the exported interface name.
- **`export default interface I<Name>`** — default export, always.
- Live under `services/<domain>/interfaces/`. Never at the domain root, never inline in the service file.
- Optional fields use `?` (`token?: string`).
- No `AxiosResponse` inside interface files — that lives in the service function signature only.
- Reuse existing interfaces across domains via path alias when applicable (e.g. `authService.ts` imports `IUser` from `@services/users/interfaces/IUser`). Do **not** duplicate a model.
- Domain-model interfaces belong under the owning service, not under the consuming form.

### 3. Create or extend the service file

Use [assets/domainService.ts.template](./assets/domainService.ts.template) as the starting point for a **new** domain. If the domain file already exists, add the new endpoint constant + function alongside the existing ones — keep the constants grouped at the top.

Rules (invariants):

- **Import `axiosInstance` from `@services/axiosInstance`.** Never `import axios from "axios"` at the call site — that bypasses baseURL, auth header, locale header, and query serializer.
- **Import `AxiosResponse` and `CancelToken` from `axios`** (types only).
- **Named `export async function`** — never `export default`, never `const foo = async () => …`, never anonymous. The `function` keyword is required (matches [react.instructions.md](../../instructions/react.instructions.md) and [typescript.instructions.md](../../instructions/typescript.instructions.md) conventions for stack traces).
- **Function name = HTTP verb + Resource** in camelCase: `get`, `post`, `put`, `patch`, `delete` (as prefix) + `Resource`. Examples: `getMe`, `postLogin`, `getProjects`, `putProject`, `patchProject`, `deleteSession`.
- **Return type is `Promise<AxiosResponse<I<Model>>>`** — the FULL response, not `.data`. Callers destructure `{ data }` themselves.
- **Signature order** — `(body/payload, ...pathOrQueryArgs, cancelToken?: CancelToken)`. `cancelToken` is always the last parameter and always optional.
- **Always pass `cancelToken` through** to the axios options, even when the caller won't use it: `{ cancelToken }`.
- **URL constants at the top of the file** in `SCREAMING_SNAKE_CASE`, composed from the domain prefix. One constant per endpoint. No inline string URLs in function bodies.
- **No `try/catch` inside services.** Errors propagate to the caller. The caller decides what to `toast` or how to recover.
- **No side effects** — no `localStorage`, no navigation, no toasts, no logging. Pure request-in / response-out.
- **No forbidden imports** — services must not import from `@stores`, `@containers`, `@pages`, `@forms`, `@components`, `@hocs`, `react-i18next`, `react-router-dom`, or `react`. If you find yourself reaching for one, the logic belongs in the caller.

Verb → HTTP method mapping:

| Function prefix | axios method | Body? |
|---|---|---|
| `get<Resource>` | `axiosInstance.get(url, { cancelToken })` | no |
| `post<Resource>` | `axiosInstance.post(url, body, { cancelToken })` | yes |
| `put<Resource>` | `axiosInstance.put(url, body, { cancelToken })` | yes |
| `patch<Resource>` | `axiosInstance.patch(url, body, { cancelToken })` | yes |
| `delete<Resource>` | `axiosInstance.delete(url, { cancelToken })` | no |

For query params, pass them via `params` inside the config object; `qs` handles arrays via the configured `paramsSerializer` — do not roll your own.

### 4. Do not modify `axiosInstance.ts`

The instance is shared. Do not:
- Create a second axios instance.
- Add headers at call sites — put them in the interceptor if truly needed (rare).
- Touch `paramsSerializer` — arrays as repeated params is a public contract.
- Replace token constants with string literals — always use `ACCESS_TOKEN` / `REFRESH_TOKEN` from `@shared/constants`.

If the user asks to change any of the above, stop and confirm — that's an infra change, not an "add a service" task.

### 5. Do not build a wrapper API layer

- No `services/index.ts` re-exports.
- No "repository" or "client" class abstracting the service.
- No shared error-normalization layer (the app deliberately handles errors per call site).
- Callers import the function directly: `import { postLogin } from "@services/auth/authService"`.

### 6. Guide the caller (do not implement the call here)

The service is a leaf. The caller (form, container, or page) is responsible for:

- Wrapping the call in `.then(({ data }) => …).catch(error => …).finally(…)` — not `await`.
- Destructuring `{ data }` in `.then`.
- Matching known errors first (`error.response?.status === 401`, `error.response?.data?.message === "…"`), then falling back to `toast.error(t("errors__generic"), { toastId: "generic" })`.
- Toggling `setIsLoading` in `.finally`.
- Any localStorage, store hydration, or navigation.

If a form will consume this service, use the `add-form` skill next — it enforces those rules end-to-end. If the caller is a container or page, follow the patterns in [services-api.instructions.md](../../instructions/services-api.instructions.md) and [forms.instructions.md](../../instructions/forms.instructions.md).

Note about 401: only `AuthProvider` (bootstrap `getMe`) implements the "expired session → remove token → navigate to login" flow. Do **not** replicate that in other callers — regular services just surface an error toast.

### 7. Verify

From `frontend/`:

1. `yarn lint:scripts` — catches unused imports, wrong types, forbidden `import axios` from `"axios"`.
2. `yarn build` — full type check via `tsc -b`. Confirms the interface + `AxiosResponse<T>` wiring is correct.
3. Only run a live network call once a caller is wired up; services are not runnable on their own.

## Completion Checklist

Before reporting done, verify all apply:

- [ ] Folder `services/<domain>/` exists (created or reused).
- [ ] `<domain>Service.ts` uses `import axiosInstance from "@services/axiosInstance"`, never bare `import axios`.
- [ ] `AxiosResponse` and `CancelToken` are imported as types from `"axios"`.
- [ ] `<DOMAIN>_PREFIX` and each `<VERB>_<RESOURCE>` are declared as `SCREAMING_SNAKE_CASE` constants at the top of the file.
- [ ] Every function is `export async function <verb><Resource>(…): Promise<AxiosResponse<I<Model>>>`.
- [ ] `cancelToken?: CancelToken` is the last parameter and is passed through to the axios options.
- [ ] No `try/catch`, no side effects, no forbidden imports inside the service file.
- [ ] Each new interface lives under `services/<domain>/interfaces/I<Name>.ts` with `export default interface I<Name>`.
- [ ] Existing interfaces have been reused where appropriate (no duplicated models).
- [ ] `axiosInstance.ts` has not been modified.
- [ ] `yarn lint:scripts` passes.
- [ ] `yarn build` passes.

## Anti-patterns to Reject

- `import axios from "axios"` inside a service or caller — always the shared `axiosInstance`.
- `export default async function …` or `export const foo = async () => …` — must be `export async function <name>` (named).
- Returning `Promise<T>` instead of `Promise<AxiosResponse<T>>` — callers destructure `{ data }`.
- Inline URL strings inside function bodies instead of top-of-file constants.
- `try/catch` inside a service, or normalizing errors before returning.
- Doing `localStorage`, `toast`, `navigate`, or `useTranslation` inside a service.
- Creating a second axios instance for a "different backend" — extend `axiosInstance` via config if truly needed, and only after confirming with the user.
- Rolling a custom query-string serializer — the `qs` config on `axiosInstance` is the contract.
- Wrapping every service in a repository/client class — the app deliberately calls functions directly.
- Adding an `index.ts` barrel for the services folder — import from the specific file (`@services/<domain>/<domain>Service`).
- Colocating interfaces inside the service file instead of `interfaces/I<Name>.ts`.
- Duplicating a model across domains — reuse via `@services/<other>/interfaces/I<Name>`.
- Replicating the 401 "log the user out" flow outside `AuthProvider`.

## References

- [services-api.instructions.md](../../instructions/services-api.instructions.md) — the full rules this skill enforces.
- [forms.instructions.md](../../instructions/forms.instructions.md) — how forms consume services (`.then/.catch/.finally`, toasts, loading).
- [typescript.instructions.md](../../instructions/typescript.instructions.md) — `I` prefix, file naming, named exports.
- [react.instructions.md](../../instructions/react.instructions.md) — `function` keyword rule.
- [i18n.instructions.md](../../instructions/i18n.instructions.md) — `errors__*` keys used by callers, not by services.

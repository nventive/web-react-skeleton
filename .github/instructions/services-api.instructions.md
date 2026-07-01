---
description: Axios service conventions — folder layout, axiosInstance, function shape, interfaces, and error handling boundaries.
applyTo: "frontend/src/app/services/**/*.{ts,tsx}"
---

# Services & API

Scope: everything under `@services/*` — the shared `axiosInstance`, per-domain service files, and their interfaces.

Complementary files (do not repeat their content here):
- [typescript.instructions.md](typescript.instructions.md) — `I` prefix, one interface per file, path aliases, `interface` vs `type`.
- [components-vs-containers.instructions.md](components-vs-containers.instructions.md) — who is allowed to call services (containers, pages, forms — **not** presentational components).
- [routing-and-auth.instructions.md](routing-and-auth.instructions.md) — how `AuthProvider` bootstraps `getMe`; token constants in `@shared/constants`.
- [i18n.instructions.md](i18n.instructions.md) — how the caller maps errors to `toast.error(t("errors__..."))` with a stable `toastId`.
- [react.instructions.md](react.instructions.md) — where the `.then / .catch / .finally` chain lives (in `useCallback` inside a container/form).

HTTP client: `axios` v1. Query-string serializer: `qs`. Base URL: `__API_URL__` (Vite `define`).

---

## Folder layout

Every backend domain becomes one folder under `@services/<domain>/`:

```
services/
  axiosInstance.ts                      <-- shared instance (do not duplicate)
  <domain>/
    <domain>Service.ts                  <-- exports named async functions
    interfaces/
      I<Model>.ts                       <-- one interface per file, default export
      I<Request>.ts
      I<Response>.ts
```

Rules:
- **One folder per domain**, not per endpoint. `authService.ts` owns every `/auth/*` call; `userService.ts` owns every `/user/*` call. Do not create `loginService.ts`.
- **File name = `<domain>Service.ts`** (camelCase `<domain>` + literal `Service`). Do not name it `api.ts`, `endpoints.ts`, or `<domain>.ts`.
- **Interfaces live under `interfaces/`** inside the owning domain folder. Import cross-domain interfaces via the alias (`@services/users/interfaces/IUser`) — see the login endpoint returning `IUser`.
- **Domain ownership follows the response model.** `IUser` lives under `services/users/interfaces/` because the user *is* what `/user/*` operates on, even though `postLogin` also returns one.

---

## The service function shape

Every function follows the same template:

```ts
// services/<domain>/<domain>Service.ts
import ILogin from "@services/auth/interfaces/ILogin";
import axiosInstance from "@services/axiosInstance";
import IUser from "@services/users/interfaces/IUser";
import { AxiosResponse, CancelToken } from "axios";

const AUTH_PREFIX = "/auth";
const POST_LOGIN = `${AUTH_PREFIX}/login`;

export async function postLogin(
  login: ILogin,
  cancelToken?: CancelToken,
): Promise<AxiosResponse<IUser>> {
  return await axiosInstance.post(POST_LOGIN, login, {
    cancelToken,
  });
}
```

Checklist for a new service function:

1. **URL constants at the top of the file.** `SCREAMING_SNAKE_CASE`, one per endpoint, composed from a shared `<DOMAIN>_PREFIX`.
2. **Named export**, `export async function`. Never `default export` for services; never anonymous arrow functions.
3. **Function name = HTTP verb + Resource**, camelCase: `getMe`, `postLogin`, `putProfile`, `patchProject`, `deleteSession`. The verb must match the axios method used inside.
4. **Signature order**: `(body/payload, ...queryOrPathArgs, cancelToken?: CancelToken)`. For `GET` requests without a body, path/query args come first.
5. **Return type is `Promise<AxiosResponse<IModel>>`** — return the full `AxiosResponse`, not `.data`. Callers destructure (`.then(({ data }) => ...)`).
6. **Use `axiosInstance` from `@services/axiosInstance`.** Never import `axios` directly in a service file — you'd bypass the auth token, base URL, and locale header.
7. **Pass `cancelToken` through** to the axios options object even when unused today. The signature keeps parity with existing services.
8. **Do not `try/catch` inside the service.** Let errors propagate — the caller (container / form) handles them with `.catch` + `toast.error`.
9. **Do not import** from `@stores`, `@containers`, `@pages`, `@components`, `@hocs`, `react-i18next`, `react-router-dom`, or React itself. Services are pure I/O.

### Examples of each HTTP verb

```ts
// GET with path parameter
const USER_PREFIX = "/user";
const GET_USER_BY_ID = (id: number) => `${USER_PREFIX}/${id}`;

export async function getUserById(
  id: number,
  cancelToken?: CancelToken,
): Promise<AxiosResponse<IUser>> {
  return await axiosInstance.get(GET_USER_BY_ID(id), { cancelToken });
}

// GET with query params — pass via `params`; qs handles serialization
export async function getUsers(
  filters: IUserFilters,
  cancelToken?: CancelToken,
): Promise<AxiosResponse<IUser[]>> {
  return await axiosInstance.get(`${USER_PREFIX}`, { params: filters, cancelToken });
}

// PUT with body + id
const PUT_USER = (id: number) => `${USER_PREFIX}/${id}`;

export async function putUser(
  id: number,
  user: IUserUpdate,
  cancelToken?: CancelToken,
): Promise<AxiosResponse<IUser>> {
  return await axiosInstance.put(PUT_USER(id), user, { cancelToken });
}

// DELETE
export async function deleteUser(
  id: number,
  cancelToken?: CancelToken,
): Promise<AxiosResponse<void>> {
  return await axiosInstance.delete(GET_USER_BY_ID(id), { cancelToken });
}
```

Notes:
- Endpoints that take a path parameter are exported as **arrow-function constants** returning the URL, not string templates inlined at the call site.
- The `params` config accepts a plain object; the `paramsSerializer` in `axiosInstance` handles arrays as `?ids=1&ids=2` (`arrayFormat: "repeat"`). Do not build query strings by hand.

---

## Interfaces for request/response models

- One interface per file, `I<Name>.ts`, `export default interface I<Name>`. See [typescript.instructions.md](typescript.instructions.md#interfaces-vs-type) for the full rule.
- **Request bodies** get their own interface (`ILogin`, `IUserUpdate`) — do not inline object types in the service signature.
- **Response models** get their own interface (`IUser`). If a response is a bare array, the service returns `AxiosResponse<IModel[]>`; do not create `IUsersResponse` just to wrap it.
- **Optional fields** on shared models use `?` and reflect the API reality (e.g. `IUser.token?: string` because `/auth/login` returns it but `/user/me` does not).
- Do not import `AxiosResponse` into an interface file — the axios wrapper belongs at the service signature, not in the model.

---

## The shared `axiosInstance`

The file at `@services/axiosInstance` is the **single** axios instance for the app. Do not create a second one for "special cases."

What it does:

| Concern | Where |
|---|---|
| `baseURL` | `__API_URL__` (Vite `define` in [frontend/vite.config.ts](frontend/vite.config.ts), typed in `vite-env.d.ts`). |
| Default `Content-Type` | `application/json`. |
| Query-string serializer | `qs.stringify(params, { arrayFormat: "repeat" })` — arrays become repeated params. |
| Request interceptor: `Accept-Language` | Read from the URL path prefix (`location.pathname.substring(1, 3)` or `"en"`). Keeps API responses in the current locale. |
| Request interceptor: `Authorization` | If `localStorage.getItem(ACCESS_TOKEN)` is set, adds `Bearer ${token}`. |

Rules:
- **Never** `import axios from "axios"` in a service or component. Always `import axiosInstance from "@services/axiosInstance"`.
- Do not add a second instance for "unauthenticated" calls — the interceptor already skips the header when the token is missing.
- If you need a new default header, add it to the create config or the interceptor. Do not sprinkle headers across every call site.
- Do not touch the `paramsSerializer`; it is public contract for all `params` usage.
- Token constants (`ACCESS_TOKEN`, `REFRESH_TOKEN`) come from `@shared/constants`. Do not stringly-type them.

---

## Where services get called

Services are called from **containers, pages, or forms** — never from a presentational component under `@components/*`. See [components-vs-containers.instructions.md](components-vs-containers.instructions.md).

The canonical call site pattern:

```tsx
setIsLoading(true);
postLogin(loginForm)
  .then(({ data }) => {
    if (data.token && data.refreshToken) {
      localStorage.setItem(ACCESS_TOKEN, data.token);
      localStorage.setItem(REFRESH_TOKEN, data.refreshToken);
    }
    setUser(data);
    navigate(homeRoute.paths[t("locale__key")]);
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
```

Rules that fall out of this pattern:

- **Wrap the call in a `useCallback`** (typically the `onSubmit` / `onClick` handler) — not in `useEffect` unless the fetch is genuinely on-mount data (`AuthProvider.getMe` is the reference for on-mount).
- **Loading state is owned by the caller** — the container/form flips its own `isLoading`. Services do not know about loading.
- **Destructure `.data` in `.then`** — services return the full `AxiosResponse`.
- **Handle known errors first, generic last.** Match on `error.response?.status` or `error.response?.data?.message`. Fall through to `toast.error(t("errors__generic"), { toastId: "generic" })`.
- **`toast.error` always with a stable `toastId`** — see [i18n.instructions.md](i18n.instructions.md#error-and-toast-copy).
- **`401` triggers logout in `AuthProvider`** — a plain page or form should not implement session-expiry redirect itself. See [routing-and-auth.instructions.md](routing-and-auth.instructions.md#authentication-flow).

---

## Cancellation

The current repo passes `cancelToken?: CancelToken` through every service signature but no call site actually supplies one today. Preserve the parameter for consistency with existing services — it costs nothing and makes future cancellation straightforward.

```tsx
// If a caller ever needs to abort:
const source = axios.CancelToken.source();
useEffect(() => {
  getUsers(filters, source.token).then(/* ... */).catch(/* ignore cancel */);
  return () => source.cancel();
}, [filters]);
```

Axios's `CancelToken` is deprecated in favour of `AbortController.signal`, but the repo has not migrated. Do not introduce `signal` on new services — stay consistent with the existing `CancelToken` shape until the whole layer is migrated in one pass.

---

## Common mistakes and how to fix them

### 1. Bare `axios` in a service

```ts
// Bad — bypasses baseURL, auth token, locale header, qs serializer
import axios from "axios";
export async function getMe() {
  return axios.get("/user/me");
}
```

```ts
// Good
import axiosInstance from "@services/axiosInstance";
export async function getMe(cancelToken?: CancelToken): Promise<AxiosResponse<IUser>> {
  return await axiosInstance.get(GET_ME, { cancelToken });
}
```

### 2. Returning `.data` from the service

```ts
// Bad — loses status/headers, breaks the AxiosResponse<T> contract
export async function getMe(): Promise<IUser> {
  const { data } = await axiosInstance.get(GET_ME);
  return data;
}
```

Callers rely on destructuring `.data` in `.then(({ data }) => ...)`. Keep the boundary consistent.

### 3. `try/catch` inside the service

```ts
// Bad — swallows the error and forces every caller to check a sentinel
export async function getMe() {
  try {
    return await axiosInstance.get(GET_ME);
  } catch (e) {
    toast.error("Something went wrong");
    return null;
  }
}
```

Services throw; the container/form decides UX.

### 4. Service reaching into stores

```ts
// Bad — services must not know about zustand, router, or i18n
import { useUserStore } from "@stores/userStore";
export async function refreshMe() {
  const { data } = await axiosInstance.get(GET_ME);
  useUserStore.getState().setUser(data);      // no
  return data;
}
```

The caller writes to the store. Services stay pure I/O.

### 5. Inlined URL strings

```ts
// Bad
return axiosInstance.get(`/user/${id}`, { cancelToken });

// Good
const USER_PREFIX = "/user";
const GET_USER_BY_ID = (id: number) => `${USER_PREFIX}/${id}`;
return axiosInstance.get(GET_USER_BY_ID(id), { cancelToken });
```

Constants keep endpoints greppable and prevent typos across sibling functions.

### 6. Building query strings manually

```ts
// Bad
return axiosInstance.get(`/users?ids=${ids.join(",")}&active=${active}`);

// Good — let the serializer format arrays as ?ids=1&ids=2
return axiosInstance.get(USER_PREFIX, { params: { ids, active }, cancelToken });
```

---

## Things to avoid

- `import axios from "axios"` outside `axiosInstance.ts`.
- Creating a second axios instance.
- `default export` on a service function.
- Returning anything other than `AxiosResponse<T>` from a service.
- `try/catch` inside services (the caller catches).
- Services calling stores, i18n, router, toasts, or DOM APIs.
- Inlined endpoint URLs at the call site (use the constants at the top of the service file).
- Manual query-string construction (use `params`).
- Directly reading `localStorage` in a service (the interceptor handles auth; other storage reads belong in the caller / container).
- Naming a service `api.ts`, `endpoints.ts`, or `<domain>.ts` — always `<domain>Service.ts`.
- Wrapping bare arrays in `IWrapperResponse` interfaces for no reason.
- Introducing `AbortController.signal` on new services while the rest use `CancelToken` — migrate the whole layer or none.
- Adding request logging, retry, or debounce inside a service. If globally desired, add it in the interceptor. If per-call, own it in the caller.

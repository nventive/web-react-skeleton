import {
  type RouteConfig,
  index,
  layout,
  prefix,
  route,
} from "@react-router/dev/routes";

const PUBLIC_ROUTES = "./routes/public-routes";
const AUTHENTICATED_ROUTES = "./routes/authenticated-routes";

export default [
  index("./routes/index.tsx"),

  ...prefix(":lang", [
    // public routes
    layout(`${PUBLIC_ROUTES}/layout.tsx`, [
      route("home", `${PUBLIC_ROUTES}/home/home.tsx`),
      route("login", `${PUBLIC_ROUTES}/login/login.tsx`),
    ]),

    // authenticated routes
    layout(`${AUTHENTICATED_ROUTES}/layout.tsx`, [
      route("dashboard", `${AUTHENTICATED_ROUTES}/dashboard/dashboard.tsx`),
      route("settings", `${AUTHENTICATED_ROUTES}/settings/settings.tsx`),
    ]),

    route("*", "./routes/not-found/not-found.tsx"),
  ]),
] satisfies RouteConfig;

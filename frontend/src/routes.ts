import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";
import { route as dashboardRoute } from "./routes/authenticated-routes/dashboard/route";
import { route as settingsRoute } from "./routes/authenticated-routes/settings/route";
import { route as homeRoute } from "./routes/public-routes/home/route";
import { route as loginRoute } from "./routes/public-routes/login/route";
import { route as uikitRoute } from "./routes/public-routes/uikit/route";

const PUBLIC_ROUTES_PREFIX = "./routes/public-routes";
const AUTHENTICATED_ROUTES_PREFIX = "./routes/authenticated-routes";

export interface IRoute {
  paths: {
    [key: string]: string;
  };
  file: string;
}

const PUBLIC_ROUTES: IRoute[] = [homeRoute, loginRoute];
const AUTHENTICATED_ROUTES: IRoute[] = [dashboardRoute, settingsRoute];
const ROUTES = [...PUBLIC_ROUTES, ...AUTHENTICATED_ROUTES];

const buildRoute = ({ paths, file }: IRoute) => {
  const keys = Object.keys(paths);
  return keys.map((key) => {
    return route(paths[key], file, { id: paths[key] });
  });
};

export default [
  index("./routes/index.tsx"),

  layout(
    `${PUBLIC_ROUTES_PREFIX}/layout.tsx`,
    PUBLIC_ROUTES.map(buildRoute).flat(),
  ),

  layout(
    `${AUTHENTICATED_ROUTES_PREFIX}/layout.tsx`,
    AUTHENTICATED_ROUTES.map(buildRoute).flat(),
  ),

  route("uikit", uikitRoute.file),
  route("*", "./routes/not-found/not-found.route.tsx"),
] satisfies RouteConfig;

export const findRoute = (path: string, locale: string): string => {
  let segmentValues: string[] = [];
  let segmentNames: string[] = [];

  const route = ROUTES.find((route) => {
    return Object.values(route.paths).some((pattern) => {
      segmentNames = (pattern.match(/:([^\s/]+)/g) || []).map((s) =>
        s.substring(1),
      );

      const regexPattern = pattern.replace(/:[^\s/]+/g, "([\\w-]+)");
      const regex = new RegExp(`^${regexPattern}$`);

      if (regex.test(path)) {
        const match = path.match(regex);
        if (match) {
          segmentValues = match.slice(1);
        }
        return true;
      }
      return false;
    });
  });

  if (!route) {
    return path;
  }

  let newPath = route.paths[locale as keyof IRoute["paths"]];
  segmentNames.forEach((segmentName, index) => {
    newPath = newPath.replace(`:${segmentName}`, segmentValues[index] || "");
  });

  return newPath;
};

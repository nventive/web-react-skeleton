import homeRoute from "@pages/home/home.route";
import notFoundRoute from "@pages/notFound/notFound.route";
import routes from "@routes/routes";
import { useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";

export default function Router() {
  const { t } = useTranslation();
  const localePath = t("locale__key");

  const routesObj = useMemo(
    () =>
      routes.flatMap((route) =>
        Object.values(route.paths).map((path) => ({
          element: (
            <>
              <Helmet htmlAttributes={{ lang: localePath }}>
                <title>
                  {t(route.name)} - {t("routes__page_title")}
                </title>
              </Helmet>
              <route.component />
            </>
          ),
          path,
        })),
      ),
    [t, localePath],
  );

  const router = useMemo(
    () =>
      createBrowserRouter([
        {
          element: <Navigate to={homeRoute.paths[localePath]} />,
          path: "/",
        },
        ...routesObj,
        {
          element: <notFoundRoute.component />,
          path: notFoundRoute.paths[localePath],
        },
      ]),
    [routesObj, localePath],
  );

  return <RouterProvider router={router} />;
}

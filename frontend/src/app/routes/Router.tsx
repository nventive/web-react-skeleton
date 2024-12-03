import DebugBanner from "@components/debugBanner/DebugBanner";
import notFoundRoute from "@pages/notFound/notFound.route";
import protectedRoutes from "@routes/routes.protected";
import publicRoutes from "@routes/routes.public";
import DashboardLayout from "@components/layouts/Dashboard";
import { Suspense, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import {
  Navigate,
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import AuthGuard from "@containers/authGuard/AuthGuard";
import loginRoute from "@pages/login/login.route";
import Loading from "@components/loading/Loading";

export default function Router() {
  const { t } = useTranslation();
  const localePath = t("locale__key");

  const router = useMemo(() => {
    return createBrowserRouter(
      createRoutesFromElements(
        <>
          <Route
            path="/"
            element={<Navigate to={loginRoute.paths[localePath]} />}
          />

          {/* Protected routes - requiring auth guard, living inside the dashboard layout */}
          <Route
            element={
              <>
                <AuthGuard>
                  <DashboardLayout />
                </AuthGuard>
                <DebugBanner />
              </>
            }
          >
            {protectedRoutes.flatMap((route) =>
              Object.values(route.paths).map((path, index) => (
                <Route
                  key={index}
                  path={path}
                  element={
                    <>
                      <Helmet htmlAttributes={{ lang: localePath }}>
                        <title>
                          {t(route.name)} - {t("routes__page_title")}
                        </title>
                      </Helmet>
                      <Suspense fallback={<Loading />}>
                        <route.component />
                      </Suspense>
                    </>
                  }
                />
              )),
            )}
          </Route>

          {/* 
            Public routes - if they live inside a common layout, 
            you can wrap this block inside a Router component 
          */}
          {publicRoutes.flatMap((route) =>
            Object.values(route.paths).map((path, index) => (
              <Route
                key={index}
                path={path}
                element={
                  <>
                    <Helmet htmlAttributes={{ lang: localePath }}>
                      <title>
                        {t(route.name)} - {t("routes__page_title")}
                      </title>
                    </Helmet>

                    <Suspense fallback={<Loading />}>
                      <route.component />
                    </Suspense>

                    <DebugBanner />
                  </>
                }
              />
            )),
          )}

          <Route
            path={notFoundRoute.paths[localePath]}
            element={<notFoundRoute.component />}
          />
        </>,
      ),
    );
  }, [t, localePath]);

  return <RouterProvider router={router} />;
}

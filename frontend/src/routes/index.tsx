import Loading from "@components/loading/Loading";
import { route as dashboardRoute } from "@routes/authenticated-routes/dashboard/route";
import { route as homeRoute } from "@routes/public-routes/home/route";
import i18next from "@shared/i18n";
import { useUserStore } from "@stores/userStore";
import { type MetaFunction, redirect } from "react-router";
import type { Route } from "./+types";

export const clientLoader = ({
  params: _params,
  request: _request,
}: Route.ClientLoaderArgs) => {
  const { user } = useUserStore.getState();
  if (user) {
    return redirect(dashboardRoute.paths[i18next.language]);
  } else {
    return redirect(homeRoute.paths[i18next.language]);
  }
};

export const meta: MetaFunction<typeof clientLoader> = ({
  params: _params,
}) => {
  return [{ title: "..." }];
};

export default function Home() {
  return <Loading />;
}

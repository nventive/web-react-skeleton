import Loading from "@components/loading/Loading";
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
    return redirect(`/${i18next.language}/dashboard`);
  } else {
    return redirect(`/${i18next.language}/home`);
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

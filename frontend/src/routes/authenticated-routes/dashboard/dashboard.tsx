import Loading from "@components/loading/Loading";
import { Grid2 as Grid, Typography } from "@mui/material";
import { postsQueryOptions } from "@services/posts/postsQueries";
import { todosQueryOptions } from "@services/todos/todosQueries";
import i18next from "@shared/i18n";
import { queryClient } from "@shared/queryClient";
import { useUserStore } from "@stores/userStore";
import { useQuery } from "@tanstack/react-query";
import { lazy, Suspense } from "react";
import { useTranslation } from "react-i18next";
import { Await } from "react-router";
import type { Route } from "./+types/dashboard";
import { Todos } from "./components/todos";

const Posts = lazy(() => import("./components/posts"));

export const clientLoader = async ({
  params: _params,
}: Route.ClientLoaderArgs) => {
  const { user } = useUserStore.getState();

  if (user) {
    queryClient.prefetchQuery(todosQueryOptions());
    queryClient.prefetchQuery(postsQueryOptions());
  }

  return {};
};

export const meta = () => {
  const t = i18next.getFixedT(i18next.language);
  const title = t("dashboard__page_title");

  return [{ title }];
};

export default function Home() {
  const { t } = useTranslation();
  const { user } = useUserStore();

  // For this approach, we are using useQuery().promise and the <Await> component from react-router
  // Keep in mind that this is only possible by enabling the experimental_prefetchInRender flag in the QueryClient
  // Since we a calling the useQuery hook from the component, react-query will track this query
  const postsWithBigDelay = useQuery(postsQueryOptions()).promise;

  return (
    <div>
      <Typography
        variant="h2"
        mb={8}
      >{`${t("dashboard__welcome")} ${user?.firstName} ${user?.lastName}`}</Typography>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="h3">{t("dashboard__five_todos")}</Typography>
          <Typography variant="caption">
            {t("dashboard__loading_strategy_one")}
          </Typography>

          <Todos />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="h2">{t("dashboard__three_posts")}</Typography>
          <Typography variant="caption">
            {t("dashboard__loading_strategy_three")}
          </Typography>

          <Suspense fallback={<Loading />}>
            {postsWithBigDelay && (
              <Await resolve={postsWithBigDelay}>
                {(data) => <Posts data={data} />}
              </Await>
            )}
          </Suspense>
        </Grid>
      </Grid>
    </div>
  );
}

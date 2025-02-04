import Loading from "@components/loading/Loading";
import { Grid2 as Grid, Typography } from "@mui/material";
import {
  postsQueryOptions,
  postsQueryWithBiggerDelayOptions,
} from "@services/posts/postsQueries";
import { todosQueryOptions } from "@services/todos/todosQueries";
import i18next from "@shared/i18n";
import { queryClient } from "@shared/queryClient";
import { useUserStore } from "@stores/userStore";
import { useQuery } from "@tanstack/react-query";
import { lazy, Suspense } from "react";
import { useTranslation } from "react-i18next";
import { Await } from "react-router";
import type { Route } from "./+types/dashboard.route";
import { Todos } from "./todos";

const Posts = lazy(() => import("./posts"));

export const clientLoader = async ({
  params: _params,
}: Route.ClientLoaderArgs) => {
  const { user } = useUserStore.getState();

  if (user) {
    // A first approach is to use the loader to prefetch the queries and have the components call
    // react-query's useQuery hook. The API call is done not on-render, but before.
    const todos = todosQueryOptions();
    queryClient.prefetchQuery(todos);

    const postsWithBigDelay = postsQueryWithBiggerDelayOptions();
    queryClient.prefetchQuery(postsWithBigDelay);

    // For a different approach, notice how this is not awaited. We want to return this as a non-blocking promise
    const postsQuery = queryClient.fetchQuery(postsQueryOptions());

    return {
      postsQuery,
    };
  }

  return {};
};

export const meta = ({ params }: Route.MetaArgs) => {
  const t = i18next.getFixedT(params.lang as string);
  const title = t("dashboard__page_title");

  return [{ title }];
};

export default function Home({ loaderData }: Route.ComponentProps) {
  const { t } = useTranslation();
  const { user } = useUserStore();

  // We are getting the promise from the loaderData, which is the recommended way
  // This approach is great for rendering parts of the component taht do not depend on the data
  // while the data is being fetched. We can wrap those inside <Suspense> & <Await> components.
  // HOWEVER, since we are not calling react-query's useQuery hook, the query is not being tracked
  const { postsQuery } = loaderData;

  // For this approach, we are using useQuery().promise and the <Await> component from react-router
  // Keep in mind that this is only possible by enabling the experimental_prefetchInRender flag in the QueryClient
  // Since we a calling the useQuery hook from the component, react-query will track this query
  const postsWithBigDelay = useQuery(
    postsQueryWithBiggerDelayOptions(),
  ).promise;

  return (
    <div>
      <Typography
        variant="h2"
        mb={8}
      >{`${t("dashboard__welcome")} ${user?.firstName} ${user?.lastName}`}</Typography>

      <Grid container spacing={2}>
        <Grid size={12}>
          <Typography variant="h3">{t("dashboard__five_todos")}</Typography>
          <Typography variant="caption">
            {t("dashboard__loading_strategy_one")}
          </Typography>
          <Todos />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="h2">{t("dashboard__three_posts")}</Typography>
          <Typography variant="caption">
            {t("dashboard__loading_strategy_two")}
          </Typography>

          <Suspense fallback={<Loading />}>
            {postsQuery && (
              <Await resolve={postsQuery}>
                {(data) => <Posts data={data} />}
              </Await>
            )}
          </Suspense>
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

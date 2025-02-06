# Data Fetching Strategies

This project demonstrates the 2 different data fetching strategies using `react-query` and `react-router` loaders. Below is a high-level explanation of each strategy:

## 1. Prefetching in loader + `useSuspenseQuery`

```tsx
export const clientLoader = async () => {
  queryClient.prefetchQuery(queryOptions());
  return {};
};

export default function MyRoute() {
  const { data: todos } = useSuspenseQuery(queryOptions());
  return (
    <div>
      {todos.map((todo) => (
        <div key={todo.id}>{todo.todo}</div>
      ))}
    </div>
  );
}
```

In this approach, we use the loader to **prefetch** our data, but notice the loader does not return the data itself.  
In the rendered component, we use the `useSuspenseQuery` hook to get the data (you can call the `useQuery` too, but will need to handle loading / pending states).  
**`On the very first render`**, the `useSuspenseQuery` hook suspends the component until the query is resolved.  
The `Suspense` component wrapping the component displays a fallback while the data is being fetched.
**`On subsequent renders`**, the `useSuspenseQuery` hook will return stale data while fetching any new data.

- **Pros**: The `useSuspenseQuery` hook ensures the component only renders when data is available.
- **Pros**: The `useSuspenseQuery` returns stale data immediately (if available) while new data is fetched.
- **Cons**: Initial render of the whole page is blocked until data is fetched (which will be caugh by the Suspense compoenent wrapping this page).

## 2. Prefetching in Loader + `useQuery().promise`

```tsx
export const clientLoader = async () => {
  queryClient.prefetchQuery(queryOptions());
  return {};
};

export default function MyRoute() {
  const query = useSuspenseQuery(queryOptions()).promise;

  return (
    <div>
      <h1>This will be rendered immediately</h1>

      <Suspense fallback={<Loading />}>
        <Await resolve={query}>{(data) => <Posts data={data} />}</Await>
      </Suspense>
    </div>
  );
}
```

This strategy also prefetches data in the loader but uses the `useQuery().promise` hook within the component, allowing for .  
The `experimental_prefetchInRender` flag in the `QueryClient` is enabled to allow this behavior.  
The `Await` component is used to handle the promise resolution.

- **Pros**: The query is tracked by `react-query`, allowing for better state management, caching and refetching.
- **Cons**: Requires enabling an experimental flag in `react-query`.

## Warning: Fetching in loader + `Await`

```tsx
export const clientLoader = async () => {
  const query = queryClient.fetchQuery(postsQueryOptions());
  return { query };
};

export default function MyRoute({ loaderData }: Route.ComponentProps) {
  const { query } = loaderData;
  return (
    <div>
      <h1>This will be rendered immediately</h1>

      <Suspense fallback={<Loading />}>
        <Await resolve={query}>{(data) => <Posts data={data} />}</Await>
      </Suspense>
    </div>
  );
}

const Posts = ({ data }) => (
  <div>
    {data.posts.map((post) => (
      <div key={post.id}>{post.title}</div>
    ))}
  </div>
);
```

Here, the data is fetched in the loader **but is not awaited**.  
The promise returned by the loader is passed to the component, and the `Await` component from `react-router` is used to handle the promise resolution.

- **Pros**: Allows rendering parts of the page that do not depend on the data while the data is being fetched.
- **Cons**: The query is not tracked by `react-query` since no hook is called from inside the component.

import { Box, Typography } from "@mui/material";
import { todosQueryOptions } from "@services/todos/todosQueries";
import { useSuspenseQuery } from "@tanstack/react-query";

export const Todos = () => {
  // Here, we are using the useSuspenseQuery hook to fetch the todos (that were prefetched on the loader)
  // By using this hook instead of useQuery(), the first time this component is rendered, it will suspend
  // until the query is resolved. The <Suspense/> component wrapping this component will display the fallback
  const { data: todos } = useSuspenseQuery(todosQueryOptions());

  // NOTE: the useSuspenseQuery call, after the initial render, will return STALE data
  // while the query is being refetched. This is the expected behavior. Keep this in mind when
  // designing your UI (UX pattern Stale-While-Revalidate)

  return (
    <Box sx={{ display: "flex", flexDirection: "column", marginY: 6 }}>
      {todos?.todos?.map((todo) => (
        <Typography key={todo.id}>{todo.todo}</Typography>
      ))}
    </Box>
  );
};

export default Todos;

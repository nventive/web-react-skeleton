import { queryOptions } from "@tanstack/react-query";
import { getTodos } from "./todosService";

export const todosQueryOptions = () => {
  return queryOptions({
    queryKey: ["dummyjson:todos"],
    queryFn: async () => {
      // Simulate a delay of 1.5s to show behavior
      await new Promise((resolve) => setTimeout(resolve, 1500));
      return await getTodos();
    },
  });
};

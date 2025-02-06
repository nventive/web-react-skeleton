import { queryOptions } from "@tanstack/react-query";
import { getPosts } from "./postsService";

export const postsQueryOptions = () => {
  return queryOptions({
    queryKey: ["dummyjson:posts-untracked"],
    queryFn: async () => {
      // Simulate a delay of 4s to show behavior
      await new Promise((resolve) => setTimeout(resolve, 4000));
      return await getPosts();
    },
  });
};

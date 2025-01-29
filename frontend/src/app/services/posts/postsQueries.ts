import { queryOptions } from "@tanstack/react-query";
import { getPosts } from "./postsService";

export const postsQueryOptions = () => {
  return queryOptions({
    queryKey: ["dummyjson:posts-untracked"],
    queryFn: async () => {
      // Simulate a delay of 3s to show behavior
      await new Promise((resolve) => setTimeout(resolve, 3000));
      return await getPosts();
    },
  });
};

export const postsQueryWithBiggerDelayOptions = () => {
  return queryOptions({
    queryKey: ["dummyjson:posts-tracked"],
    queryFn: async () => {
      // Simulate a delay of 5s to show behavior
      await new Promise((resolve) => setTimeout(resolve, 5000));
      return await getPosts();
    },
  });
};

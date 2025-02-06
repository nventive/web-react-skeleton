import axiosInstance from "@services/axiosInstance";
import { type CancelToken } from "axios";
import type IPost from "./interfaces/IPost";
import type { IPostsResponse } from "./interfaces/IPostsResponses";

export async function getPosts(
  cancelToken?: CancelToken,
): Promise<IPostsResponse<IPost>> {
  const response = await axiosInstance.get(`/posts`, {
    params: {
      limit: 3,
    },
    cancelToken,
  });
  return response.data;
}

import axiosInstance from "@services/axiosInstance";
import { type CancelToken } from "axios";
import type ITodo from "./interfaces/ITodo";
import type { ITodosResponse } from "./interfaces/ITodosResponses";

export async function getTodos(
  cancelToken?: CancelToken,
): Promise<ITodosResponse<ITodo>> {
  const response = await axiosInstance.get(`/todos`, {
    params: {
      limit: 5,
    },
    cancelToken,
  });
  return response.data;
}

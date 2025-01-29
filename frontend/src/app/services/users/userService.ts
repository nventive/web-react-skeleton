import axiosInstance from "@services/axiosInstance";
import type IUser from "@services/users/interfaces/IUser";
import { type AxiosResponse, type CancelToken } from "axios";

/**
 * the ACCESS_TOKEN is automatically added to the request headers (see axiosInstance.ts)
 * However, the token is not automatically refreshed when it expires.
 */
export async function getMe(
  cancelToken?: CancelToken,
): Promise<AxiosResponse<IUser>> {
  return await axiosInstance.get("/user/me", {
    cancelToken,
  });
}

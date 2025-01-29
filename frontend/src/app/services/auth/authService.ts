import type ILogin from "@services/auth/interfaces/ILogin";
import axiosInstance from "@services/axiosInstance";
import type IUser from "@services/users/interfaces/IUser";
import { type AxiosResponse, type CancelToken } from "axios";

export async function postLogin(
  login: ILogin,
  cancelToken?: CancelToken,
): Promise<AxiosResponse<IUser>> {
  // Simulate a delay of 1.5s to show form behavior
  await new Promise((resolve) => setTimeout(resolve, 1500));

  return await axiosInstance.post("/auth/login", login, {
    cancelToken,
  });
}

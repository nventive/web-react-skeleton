import axiosInstance from "@services/axiosInstance";
import IUser from "@services/users/interfaces/IUser";
import { AxiosResponse, CancelToken } from "axios";

const USER_PREFIX = "/user";
const GET_ME = `${USER_PREFIX}/me`;

export async function getMe(
  cancelToken?: CancelToken,
): Promise<AxiosResponse<IUser>> {
  return await axiosInstance.get(GET_ME, {
    cancelToken,
  });
}

import ILogin from "@services/auth/interfaces/ILogin";
import axiosInstance from "@services/axiosInstance";
import IUser from "@services/users/interfaces/IUser";
import { AxiosResponse } from "axios";

const AUTH_PREFIX = "/auth";
const POST_LOGIN = `${AUTH_PREFIX}/login`;

export async function postLogin(login: ILogin): Promise<AxiosResponse<IUser>> {
  return await axiosInstance.post(POST_LOGIN, login);
}

import axiosInstance from "@services/axiosInstance";
import IUser from "@services/users/interfaces/IUser";
import { AxiosResponse } from "axios";

const USER_PREFIX = "/user";
const GET_ME = `${USER_PREFIX}/me`;

export async function getMe(): Promise<AxiosResponse<IUser>> {
  return await axiosInstance.get(GET_ME);
}

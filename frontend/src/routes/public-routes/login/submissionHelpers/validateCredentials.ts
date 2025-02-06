import { postLogin } from "@services/auth/authService";
import type ILogin from "@services/auth/interfaces/ILogin";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "@shared/constants";

export const validateCredentials = async (loginForm: ILogin) => {
  const { data } = await postLogin(loginForm);
  if (data.accessToken && data.refreshToken) {
    localStorage.setItem(ACCESS_TOKEN, data.accessToken);
    localStorage.setItem(REFRESH_TOKEN, data.refreshToken);
    return data;
  }
};

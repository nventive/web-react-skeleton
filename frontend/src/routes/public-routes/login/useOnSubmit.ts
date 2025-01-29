import loginFormSchema from "@forms/auth/loginForm/loginForm.schema";
import { postLogin } from "@services/auth/authService";
import type ILogin from "@services/auth/interfaces/ILogin";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "@shared/constants";
import { useUserStore } from "@stores/userStore";
import axios from "axios";
import { t } from "i18next";
import { useState, type FormEvent } from "react";
import { toast } from "react-toastify";
import { ValidationError } from "yup";

export const useOnSubmit = (
  loginForm: ILogin,
  onSuccessfulLogin: () => void,
) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { setUser } = useUserStore();

  const validateForm = (loginForm: ILogin) => {
    try {
      loginFormSchema.validateSync(loginForm, {
        abortEarly: false,
      });
      return [];
    } catch (error) {
      if (error instanceof ValidationError) {
        return error.inner;
      } else {
        toast.error(t("errors__generic"), {
          toastId: "generic",
        });
        return null;
      }
    }
  };

  const validateCredentials = async (loginForm: ILogin) => {
    try {
      const { data } = await postLogin(loginForm);
      if (data.accessToken && data.refreshToken) {
        localStorage.setItem(ACCESS_TOKEN, data.accessToken);
        localStorage.setItem(REFRESH_TOKEN, data.refreshToken);
        return data;
      }
      throw new Error("An error occured when loging in with dummyjson.com");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.data?.message === "Invalid credentials") {
          toast.error(t("errors__invalid_credentials"), {
            toastId: "invalid-credentials",
          });
        }
      } else {
        toast.error(t("errors__generic"), {
          toastId: "generic",
        });
      }
      throw error;
    }
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const errors = validateForm(loginForm);
    if (errors === null) return;
    if (errors.length > 0) return;

    setIsLoading(true);

    try {
      const data = await validateCredentials(loginForm);
      setUser(data);
      onSuccessfulLogin();
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    onSubmit,
  };
};

import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "@stores/userStore";
import { toast } from "react-toastify";
import { ACCESS_TOKEN } from "@shared/constants";
import { getMe } from "@services/users/userService";
import loginRoute from "@pages/login/login.route";

export const useRedirectToLoginIfNoToken = () => {
  const [t] = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = localStorage.getItem(ACCESS_TOKEN);
    if (!accessToken) {
      navigate(loginRoute.paths[t("locale__key")], { replace: true });
    }
  }, [navigate, t]);
};

export const useLoadUser = () => {
  const [t] = useTranslation();
  const navigate = useNavigate();
  const { setUser, user } = useUserStore();

  useEffect(() => {
    if (user) {
      return;
    }

    getMe()
      .then(({ data }) => {
        setUser(data);
      })
      .catch((error) => {
        if (error.response?.status === 401) {
          toast.error(t("errors__expired_session"), {
            toastId: "expired-session",
          });
          localStorage.removeItem(ACCESS_TOKEN);
        } else {
          toast.error(t("errors__generic"), {
            toastId: "generic",
          });
        }
        navigate(loginRoute.paths[t("locale__key")], { replace: true });
      });
  }, [navigate, setUser, t, user]);
};

export const useCheckPermission = (_permission: string) => {
  // const { user } = useUserStore();
  // TODO: validate permission
  return true;
};

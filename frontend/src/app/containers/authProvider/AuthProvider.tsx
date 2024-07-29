import Loading from "@components/loading/Loading";
import EPermission from "@enums/EPermission";
import loginRoute from "@pages/login/login.route";
import { getMe } from "@services/users/userService";
import { ACCESS_TOKEN } from "@shared/constants";
import { useUserStore } from "@stores/userStore";
import { ReactNode, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function AuthProvider({
  children,
  permission,
}: {
  children: ReactNode;
  permission: EPermission;
}) {
  const [t] = useTranslation();
  const navigate = useNavigate();
  const { setUser, user } = useUserStore();

  useEffect(() => {
    const accessToken = localStorage.getItem(ACCESS_TOKEN);
    if (!accessToken) {
      navigate(loginRoute.paths[t("locale__key")], { replace: true });
    } else if (!user) {
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
    }

    // TODO: validate permission
  }, [navigate, permission, setUser, t, user]);

  return !user ? <Loading /> : children;
}

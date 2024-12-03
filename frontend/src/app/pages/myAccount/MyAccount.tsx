import findRoute from "@routes/findRoute";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import Button from "@components/button/Button";
import LogoutRounded from "@icons/LogoutRounded";
import { Typography } from "@mui/material";
import loginRoute from "@pages/login/login.route";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "@shared/constants";
import i18n from "@shared/i18n";
import { useUserStore } from "@stores/userStore";

function MyAccount() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { setUser } = useUserStore();

  const onChangeLanguage = () => {
    navigate(findRoute(location.pathname, t("locale__switch_key")));
    void i18n.changeLanguage(t("locale__switch_key"));
  };

  const onLogout = () => {
    localStorage.removeItem(ACCESS_TOKEN);
    localStorage.removeItem(REFRESH_TOKEN);
    setUser(undefined);
    navigate(loginRoute.paths[t("locale__key")]);
  };

  return (
    <div>
      <h1>My Account</h1>

      <div
        sx={(theme) => ({
          display: "flex",
          gap: theme.customProperties.spacing.md,
        })}
      >
        <Button variant="contained" onClick={onChangeLanguage}>
          <Typography variant="button">{t("locale__switch")}</Typography>
        </Button>

        <Button variant="contained" onClick={onLogout}>
          <LogoutRounded />
          <Typography variant="button">{t("home__logout")}</Typography>
        </Button>
      </div>
    </div>
  );
}

export default MyAccount;

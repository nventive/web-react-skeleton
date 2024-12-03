import Link from "@components/link/Link";
import Loading from "@components/loading/Loading";
import Typography from "@mui/material/Typography";
import LoginForm from "@forms/auth/loginForm/LoginForm";
import findRoute from "@routes/findRoute";
import i18n from "@shared/i18n";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import Centered from "@components/layouts/Centered";

export default function Login() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onChangeLanguage = () => {
    navigate(findRoute(location.pathname, t("locale__switch_key")));
    void i18n.changeLanguage(t("locale__switch_key"));
  };

  return (
    <>
      <Loading isLoading={isLoading} />

      <Centered>
        <div
          sx={(theme) => ({
            display: "flex",
            flexDirection: "column",
            marginBottom: theme.customProperties.spacing.lg,
          })}
        >
          <Typography
            variant="h4"
            sx={(theme) => ({
              marginBottom: theme.customProperties.spacing.md,
            })}
          >
            {t("login__page_title")}
          </Typography>
          <Typography variant="body1">User: oliviaw</Typography>
          <Typography
            variant="body1"
            sx={(theme) => ({
              marginBottom: theme.customProperties.spacing.xxs,
            })}
          >
            Password: oliviawpass
          </Typography>
          <Link href="https://dummyjson.com/users" external>
            <Typography variant="body2">{t("login__more_user")}</Typography>
          </Link>
        </div>

        <LoginForm setIsLoading={setIsLoading} />

        <div
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Link
            sx={(theme) => ({
              marginBottom: theme.customProperties.spacing.xs,
            })}
            onClick={onChangeLanguage}
          >
            <Typography variant="body2">{t("locale__switch")}</Typography>
          </Link>
          <Typography variant="body2">
            {`${t("global__version")}: ${__VERSION_NUMBER__}`}
          </Typography>
        </div>
      </Centered>
    </>
  );
}

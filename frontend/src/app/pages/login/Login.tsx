import Link from "@components/link/Link";
import Loading from "@components/loading/Loading";
import Typography from "@mui/material/Typography";
import LoginForm from "@forms/auth/loginForm/LoginForm";
import findRoute from "@routes/findRoute";
import i18n from "@shared/i18n";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import Layout from "@components/layout/Layout";
// import Container from "@mui/material-pigment-css/Container";

export default function Login() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onChangeLanguage = useCallback(() => {
    navigate(findRoute(location.pathname, t("locale__switch_key")));
    i18n.changeLanguage(t("locale__switch_key"));
  }, [navigate, t]);

  return (
    <>
      <Loading isLoading={isLoading} />

      <Layout.Auth>
        <div className="flex-column mb-lg">
          <Typography variant="h4" className="mb-md">
            {t("login__page_title")}
          </Typography>
          <Typography variant="body1" className="color-basic-body">
            User: oliviaw
          </Typography>
          <Typography variant="body1" className="color-basic-body mb-xxs">
            Password: oliviawpass
          </Typography>
          <Link href="https://dummyjson.com/users" external>
            <Typography variant="body2">{t("login__more_user")}</Typography>
          </Link>
        </div>
        <LoginForm setIsLoading={setIsLoading} />
        <div className="flex-column align-center">
          <Link className="mb-xs" onClick={onChangeLanguage}>
            <Typography variant="body2">{t("locale__switch")}</Typography>
          </Link>
          <Typography variant="body2">
            {`${t("global__version")}: ${__VERSION_NUMBER__}`}
          </Typography>
        </div>
      </Layout.Auth>
    </>
  );
}

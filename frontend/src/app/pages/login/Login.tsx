import Layout from "@components/layout/Layout";
import Link from "@components/link/Link";
import Loading from "@components/loading/Loading";
import Typography from "@components/typography/Typography";
import LoginForm from "@forms/auth/loginForm/LoginForm";
import ExternalLinkOutlined from "@icons/ExternalLinkOutlined";
import findRoute from "@routes/findRoute";
import i18n from "@shared/i18n";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

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
          <Typography.Heading4 className="mb-md">
            {t("login__page_title")}
          </Typography.Heading4>
          <Typography.Body1 className="color-basic-body">
            User: oliviaw
          </Typography.Body1>
          <Typography.Body1 className="color-basic-body mb-xxs">
            Password: oliviawpass
          </Typography.Body1>
          <Link
            href="https://dummyjson.com/users"
            target="_blank"
            rel="noreferrer"
          >
            <Typography.Body2>{t("login__more_user")}</Typography.Body2>
            <ExternalLinkOutlined className="ml-xxs" />
          </Link>
        </div>
        <LoginForm setIsLoading={setIsLoading} />
        <div className="flex-column align-center">
          <Link className="mb-xs" onClick={onChangeLanguage}>
            <Typography.Body2>{t("locale__switch")}</Typography.Body2>
          </Link>
          <Typography.Body2>
            {`${t("global__version")}: ${__VERSION_NUMBER__}`}
          </Typography.Body2>
        </div>
      </Layout.Auth>
    </>
  );
}

import Button from "@components/button/Button";
import Link from "@components/link/Link";
import LoginForm from "@forms/auth/loginForm/LoginForm";
import { Box } from "@mui/material";
import Typography from "@mui/material/Typography";
import { getMe } from "@services/users/userService";
import { ACCESS_TOKEN } from "@shared/constants";
import { default as i18next } from "@shared/i18n";
import { useUserStore } from "@stores/userStore";
import { useTranslation } from "react-i18next";
import { type MetaFunction } from "react-router";
import { useChangeLanguage } from "src/app/hooks/useChangeLanguage";
import type { Route } from "../login/+types/route";
import { handleRedirect, useHandleRedirect } from "./redirect";

/**
 * Exceptionnaly, for this loader, we will check if the user's access token
 * is present in the localStorage. If it is, we will call the getMe function
 * and set the user in the store. We will redirect the user to the home page
 * or whatever route the user was trying to access.
 */
export const clientLoader = async ({
  params: _params,
  request: _quest,
}: Route.ClientLoaderArgs) => {
  const accessToken = localStorage.getItem(ACCESS_TOKEN);

  if (!accessToken) {
    return {};
  }

  try {
    const { data } = await getMe();
    const { setUser } = useUserStore.getState();
    setUser(data);

    return handleRedirect();
  } catch (_error) {
    localStorage.removeItem(ACCESS_TOKEN);
  }

  return {};
};

export const meta: MetaFunction<typeof clientLoader> = ({ params }) => {
  const t = i18next.getFixedT(params.lang as string);
  const title = t("login__page_title");

  return [{ title }];
};

export default function Login() {
  const { t } = useTranslation();
  const { onChangeLanguage } = useChangeLanguage();
  const handleRedirect = useHandleRedirect();

  return (
    <>
      <Box
        sx={(theme) => ({
          display: "flex",
          flexDirection: "column",
          marginTop: theme.customProperties.spacing.lg,
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
        <Link to="https://dummyjson.com/users" external>
          <Typography variant="body2">{t("login__more_user")}</Typography>
        </Link>
      </Box>

      <LoginForm onSuccessfulLogin={handleRedirect} />

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Button
          sx={(theme) => ({
            marginBottom: theme.customProperties.spacing.xs,
          })}
          onClick={onChangeLanguage}
        >
          <Typography variant="body2">{t("locale__switch")}</Typography>
        </Button>
        <Typography variant="body2">
          {`${t("global__version")}: ${import.meta.env.VITE_VERSION_NUMBER}`}
        </Typography>
      </Box>
    </>
  );
}

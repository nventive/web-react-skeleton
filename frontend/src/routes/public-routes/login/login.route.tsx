import Button from "@components/button/Button";
import Link from "@components/link/Link";
import { Box } from "@mui/material";
import Typography from "@mui/material/Typography";
import type ILogin from "@services/auth/interfaces/ILogin";
import { getMe } from "@services/users/userService";
import { ACCESS_TOKEN } from "@shared/constants";
import { default as i18next } from "@shared/i18n";
import { useUserStore } from "@stores/userStore";
import axios from "axios";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useFetcher, type MetaFunction } from "react-router";
import { toast } from "react-toastify";
import { useChangeLanguage } from "src/app/hooks/useChangeLanguage";
import type { Route } from "./+types/login.route";
import LoginForm from "./loginForm/LoginForm";
import { handleRedirect } from "./redirect";
import { validateCredentials } from "./validateCredentials";

/**
 * Exceptionnaly, for this loader, we will check if the user's access token
 * is present in the localStorage. If it is, we will call the getMe function
 * and set the user in the store. We will redirect the user to the home page
 * or whatever route the user was trying to access.
 */
export const clientLoader = async ({
  params: _params,
  request: _request,
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

export const clientAction = async ({
  request,
  params,
}: Route.ClientActionArgs) => {
  const t = i18next.getFixedT(params.lang);
  const { setUser } = useUserStore.getState();
  const form = (await request.json()) as ILogin;

  try {
    const data = await validateCredentials(form);
    setUser(data);

    return handleRedirect();
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.data?.message === "Invalid credentials") {
        /**
         * The tutorials in the react router website suggest using the data() function to return errors here.
         * However, the data returned by this function is not typed properly. For now, we will return an object.
         * https://github.com/remix-run/react-router/issues/12919
         */
        return {
          message: t("errors__invalid_credentials"),
          toastId: "invalid-credentials",
          status: 400,
        };
      }
    }

    return {
      message: t("errors__generic"),
      toastId: "generic",
      status: 400,
    };
  }
};

export default function Login() {
  const { t } = useTranslation();
  const { onChangeLanguage } = useChangeLanguage();
  const fetcher = useFetcher<typeof clientAction>();

  /**
   * It is possible to set a key to the fetcher - useful when the fetcher is used across multiple components or files.
   * For that approach to work properly, everytime this component is mounted, we will generate a new key for the fetcher.
   * This allows us to reset the fetcher state when the user navigates to another page.
   * (since a fetcher.reset() function is not available https://github.com/remix-run/remix/discussions/2749 )
   * When using useFetcher() without a key, the fetcher state resets when the user navigates to another page.
   */
  // const [fetcherKey] = useState(`login-${Date.now()}`);
  // const fetcher = useFetcher<typeof clientAction>({ key: fetcherKey });

  useEffect(() => {
    if (fetcher.state !== "idle") return;

    const status = fetcher.data?.status;
    if (status && status >= 400 && status < 600) {
      const { message, toastId } = fetcher.data ?? {};
      toast.error(message, {
        toastId: toastId,
      });
    }
  }, [fetcher.state, fetcher.data, t]);

  const submit = (loginForm: ILogin) => {
    const { username, password } = loginForm;
    fetcher.submit(
      { username, password },
      { method: "POST", encType: "application/json" },
    );
  };

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
        <Typography variant="body1">{t("login__username")}: oliviaw</Typography>
        <Typography
          variant="body1"
          sx={(theme) => ({
            marginBottom: theme.customProperties.spacing.xxs,
          })}
        >
          {t("login__password")}: oliviawpass
        </Typography>
        <Link to="https://dummyjson.com/users" external>
          <Typography variant="body2">{t("login__more_user")}</Typography>
        </Link>
      </Box>

      <LoginForm fetcher={fetcher} submit={submit} />

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

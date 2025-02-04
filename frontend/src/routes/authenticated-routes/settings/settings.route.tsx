import Button from "@components/button/Button";
import LogoutRounded from "@icons/LogoutRounded";
import { Box, Typography } from "@mui/material";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "@shared/constants";
import { default as i18next } from "@shared/i18n";
import { useUserStore } from "@stores/userStore";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { useChangeLanguage } from "src/app/hooks/useChangeLanguage";
import type { Route } from "./+types/settings.route";

export const clientLoader = async ({
  params: _params,
}: Route.ClientLoaderArgs) => {
  return {};
};

export const meta = ({ params }: Route.MetaArgs) => {
  const t = i18next.getFixedT(params.lang as string);
  const title = t("dashboard__page_title");

  return [{ title }];
};

export default function Settings() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { setUser } = useUserStore();
  const { onChangeLanguage } = useChangeLanguage();

  const onLogout = () => {
    localStorage.removeItem(ACCESS_TOKEN);
    localStorage.removeItem(REFRESH_TOKEN);
    setUser(undefined);
    navigate(`/${i18next.language}/login`);
  };

  return (
    <div>
      <h1>My Account</h1>

      <Box
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
          <Typography variant="button">{t("global__logout")}</Typography>
        </Button>
      </Box>
    </div>
  );
}

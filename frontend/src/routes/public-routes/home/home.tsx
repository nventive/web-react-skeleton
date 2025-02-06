import Button from "@components/button/Button";
import Link from "@components/link/Link";
import { Box, Typography } from "@mui/material";
import { route as dashboardRoute } from "@routes/authenticated-routes/dashboard/route";
import { route as loginRoute } from "@routes/public-routes/login/route";
import { default as i18next } from "@shared/i18n";
import { useUserStore } from "@stores/userStore";
import { useTranslation } from "react-i18next";
import { useChangeLanguage } from "src/app/hooks/useChangeLanguage";

const UserLoggedIn: React.FC = () => {
  const { user } = useUserStore();
  const { t } = useTranslation();

  if (!user) {
    return (
      <Typography variant="body1" whiteSpace="pre" mb={4}>
        <Link to={loginRoute.paths[i18next.language]}>
          {t("home__login_here")}
        </Link>
      </Typography>
    );
  }

  return (
    <>
      <Typography variant="h4">
        {`${t("home__welcome")} ${user?.firstName} ${user?.lastName}`}
      </Typography>

      <Typography variant="body1">
        <Link to={dashboardRoute.paths[i18next.language]}>
          {t("home__dashboard_here")}
        </Link>
      </Typography>
    </>
  );
};

export default function Home() {
  const { t } = useTranslation();
  const { onChangeLanguage } = useChangeLanguage();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <h1>{t("home__page_title")}</h1>

      <UserLoggedIn />

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
  );
}

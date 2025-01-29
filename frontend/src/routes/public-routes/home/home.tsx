import Button from "@components/button/Button";
import Link from "@components/link/Link";
import { Box, Typography } from "@mui/material";
import { default as i18next } from "@shared/i18n";
import { useUserStore } from "@stores/userStore";
import { useTranslation } from "react-i18next";
import { useChangeLanguage } from "src/app/hooks/useChangeLanguage";

const UserLoggedIn: React.FC = () => {
  const { user } = useUserStore();

  if (!user) {
    return (
      <Typography variant="body1" whiteSpace="pre" mb={4}>
        Click <Link to={`/${i18next.language}/login`}>here</Link> to login
      </Typography>
    );
  }

  return (
    <>
      <Typography variant="h4">
        {`Welcome ${user?.firstName} ${user?.lastName}`}
      </Typography>

      <Typography variant="body1">
        Click <Link to={`/${i18next.language}/dashboard`}>here</Link> to go to
        the dashboard
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
      <h1>Home!</h1>

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

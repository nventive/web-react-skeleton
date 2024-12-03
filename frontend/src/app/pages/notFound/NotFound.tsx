import Button from "@components/button/Button";
import Typography from "@mui/material/Typography";
import homeRoute from "@pages/home/home.route";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import classes from "./not-found.module.css";

export default function NotFound() {
  const [t] = useTranslation();
  const navigate = useNavigate();

  return (
    <div
      sx={(theme) => ({
        padding: theme.spacing(4),
      })}
      className={classes["not-found"]}
    >
      <div className={classes["container"]}>
        <Typography variant="h5" mb={"md"}>
          {t("not_found__title")}
        </Typography>

        <Typography
          variant="overline"
          sx={(theme) => ({
            marginBottom: theme.customProperties.spacing.xl,
          })}
        >
          {t("not_found__description")}
        </Typography>

        <Typography
          variant="body1"
          sx={(theme) => ({
            marginBottom: theme.customProperties.spacing.lg,
          })}
        >
          {t("not_found__description_secondary")}
        </Typography>

        <Button
          onClick={() => navigate(homeRoute.paths[t("locale__key")])}
          variant="contained"
        >
          {t("not_found__go_to_home_page")}
        </Button>
      </div>
    </div>
  );
}

import Button from "@components/button/Button";
import Typography from "@components/typography/Typography";
import homeRoute from "@pages/home/home.route";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import "./not-found.scss";

export default function NotFound() {
  const [t] = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="not-found">
      <div className="not-found__container">
        <Typography.Heading5 className="mb-md">
          {t("not_found__title")}
        </Typography.Heading5>
        <Typography.Overline className="mb-xl">
          {t("not_found__description")}
        </Typography.Overline>
        <Typography.Body1 className="mb-lg">
          {t("not_found__description_secondary")}
        </Typography.Body1>
        <Button
          onClick={() =>
            navigate(homeRoute.paths[t("locale__key")], {
              replace: true,
            })
          }
          variant="contained"
        >
          {t("not_found__go_to_home_page")}
        </Button>
      </div>
    </div>
  );
}

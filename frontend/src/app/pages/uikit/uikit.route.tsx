import en from "@assets/locales/en.json";
import fr from "@assets/locales/fr.json";
import { IRoute } from "@routes/interfaces/IRoute";
import { lazy } from "react";

const loadRequestRoute: IRoute = {
  name: "home__page_title",
  component: lazy(() =>
    __ENV__ !== "prod"
      ? import("./withAuthUikit")
      : import("../notFound/NotFound"),
  ),
  paths: {
    en: `/${en.locale__key}/uikit`,
    fr: `/${fr.locale__key}/uikit`,
  },
};

export default loadRequestRoute;

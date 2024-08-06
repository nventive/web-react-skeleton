import en from "@assets/locales/en.json";
import fr from "@assets/locales/fr.json";
import { IRoute } from "@routes/interfaces/IRoute";
import { lazy } from "react";

const loadRequestRoute: IRoute = {
  component: lazy(() => import("./withAuthHome")),
  name: "home__page_title",
  paths: {
    en: `/${en.locale__key}/${en.routes__home}`,
    fr: `/${fr.locale__key}/${fr.routes__home}`,
  },
};

export default loadRequestRoute;

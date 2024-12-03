import en from "@assets/locales/en.json";
import fr from "@assets/locales/fr.json";
import { IRoute } from "@routes/interfaces/IRoute";
import { lazy } from "react";

const uikitRoute: IRoute = {
  name: "uikit__page_title",
  component: lazy(() => import("./UiKit")),
  paths: {
    en: `/${en.locale__key}/${en.routes__uikit}`,
    fr: `/${fr.locale__key}/${fr.routes__uikit}`,
  },
};

export default uikitRoute;

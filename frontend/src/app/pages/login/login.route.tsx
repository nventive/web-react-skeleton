import en from "@assets/locales/en.json";
import fr from "@assets/locales/fr.json";
import { IRoute } from "@routes/interfaces/IRoute";
import { lazy } from "react";

const loginRoute: IRoute = {
  name: "login__page_title",
  component: lazy(() => import("./Login")),
  paths: {
    en: `/${en.locale__key}/${en.routes__login}`,
    fr: `/${fr.locale__key}/${fr.routes__login}`,
  },
};

export default loginRoute;

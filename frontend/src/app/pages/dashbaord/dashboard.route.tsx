import en from "@assets/locales/en.json";
import fr from "@assets/locales/fr.json";
import { IRoute } from "@routes/interfaces/IRoute";
import { lazy } from "react";

const dashboardRoute: IRoute = {
  name: "dashboard__page_title",
  component: lazy(() => import("./withAuthDashboard")),
  paths: {
    en: `/${en.locale__key}/${en.routes__dashboard}`,
    fr: `/${fr.locale__key}/${fr.routes__dashboard}`,
  },
};

export default dashboardRoute;

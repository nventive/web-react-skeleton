import en from "@assets/locales/en.json";
import fr from "@assets/locales/fr.json";
import { IRoute } from "@routes/interfaces/IRoute";
import { lazy } from "react";

const myAccountRoute: IRoute = {
  name: "my_account__page_title",
  component: lazy(() => import("./withPermissionMyAccount")),
  paths: {
    en: `/app/${en.locale__key}/${en.routes__my_account}`,
    fr: `/app/${fr.locale__key}/${fr.routes__my_account}`,
  },
};

export default myAccountRoute;

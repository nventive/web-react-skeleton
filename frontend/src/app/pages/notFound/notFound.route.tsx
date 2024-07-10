import { IRoute } from "@routes/interfaces/IRoute";
import { lazy } from "react";

const notFoundRoute: IRoute = {
  name: "not_found__page_title",
  component: lazy(() => import("./NotFound")),
  paths: {
    en: "*",
    fr: "*",
  },
};

export default notFoundRoute;

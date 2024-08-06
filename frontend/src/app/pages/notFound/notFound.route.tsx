import { IRoute } from "@routes/interfaces/IRoute";
import { lazy } from "react";

const notFoundRoute: IRoute = {
  component: lazy(() => import("./NotFound")),
  name: "not_found__page_title",
  paths: {
    en: "*",
    fr: "*",
  },
};

export default notFoundRoute;

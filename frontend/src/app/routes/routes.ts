import homeRoute from "@pages/home/home.route";
import loginRoute from "@pages/login/login.route";
import uikitRoute from "@pages/uikit/uikit.route";

const routes = [homeRoute, loginRoute];

if (__ENV__ !== "prod") {
  routes.push(uikitRoute);
}

export default routes;

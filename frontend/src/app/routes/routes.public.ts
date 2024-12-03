import loginRoute from "@pages/login/login.route";
import uikitRoute from "@pages/uikit/uikit.route";

const publicRoutes = [loginRoute];

if (__ENV__ !== "prod") {
  publicRoutes.push(uikitRoute);
}

export default publicRoutes;

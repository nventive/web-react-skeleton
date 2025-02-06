import en from "#assets/locales/en.json";
import fr from "#assets/locales/fr.json";
import type { IRoute } from "src/routes";

export const route: IRoute = {
  paths: {
    en: `/${en.locale__key}/${en.routes__login}`,
    fr: `/${fr.locale__key}/${fr.routes__login}`,
  },
  file: `./routes/public-routes/login/login.tsx`,
};

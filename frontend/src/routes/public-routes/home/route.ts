import en from "#assets/locales/en.json";
import fr from "#assets/locales/fr.json";
import type { IRoute } from "src/routes";

export const route: IRoute = {
  paths: {
    en: `/${en.locale__key}/${en.routes__home}`,
    fr: `/${fr.locale__key}/${fr.routes__home}`,
  },
  file: `./routes/public-routes/home/home.tsx`,
};

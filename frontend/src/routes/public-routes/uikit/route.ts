import en from "#assets/locales/en.json";
import fr from "#assets/locales/fr.json";
import type { IRoute } from "src/routes";

export const route: IRoute = {
  paths: {
    en: `${en.routes__uikit}`,
    fr: `${fr.routes__uikit}`,
  },
  file: `./routes/public-routes/uikit/uikit.tsx`,
};

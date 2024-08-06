import en from "@assets/locales/en.json";
import fr from "@assets/locales/fr.json";
import { EN, FR } from "@shared/constants";
import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

declare module "i18next" {
  interface CustomTypeOptions {
    returnNull: false;
  }
}

void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    detection: {
      order: ["path", "navigator"],
    },
    fallbackLng: EN,
    interpolation: {
      escapeValue: false,
    },
    resources: {
      [EN]: {
        translation: en,
      },
      [FR]: {
        translation: fr,
      },
    },
    returnNull: false,
    supportedLngs: [FR, EN],
  });

export default i18n;

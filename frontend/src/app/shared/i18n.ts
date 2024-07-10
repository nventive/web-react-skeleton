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
    resources: {
      [FR]: {
        translation: fr,
      },
      [EN]: {
        translation: en,
      },
    },
    interpolation: {
      escapeValue: false,
    },
    fallbackLng: EN,
    supportedLngs: [FR, EN],
    detection: {
      order: ["path", "navigator"],
    },
    returnNull: false,
  });

export default i18n;

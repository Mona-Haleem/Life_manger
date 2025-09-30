import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import HttpApi from "i18next-http-backend";

i18n
  .use(HttpApi) // load translations from /public/locales
  .use(LanguageDetector) // detect user language
  .use(initReactI18next) // pass to react-i18next
  .init({
    supportedLngs: ["en", "ar"],
    fallbackLng: "en",
    detection: {
      order: ["querystring", "cookie", "localStorage", "navigator"],
      caches: ["localStorage", "cookie"],
    },
    backend: {
      loadPath: "/locales/{{lng}}.json", // path to JSON files
    },
    interpolation: {
      escapeValue: false, // react already escapes
    },
  });

export default i18n;

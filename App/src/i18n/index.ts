import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { getLocales } from "expo-localization";

import { resources, AppLanguage } from "./resources";

const locales = getLocales();
const deviceLanguage = locales[0]?.languageCode?.toLowerCase();

const getInitialLanguage = (): AppLanguage => {
  if (deviceLanguage === "pt") {
    return "pt";
  }

  return "en";
};

i18n
  .use(initReactI18next)
  .init({
    compatibilityJSON: "v4",
    resources,
    lng: getInitialLanguage(),
    fallbackLng: "pt",
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
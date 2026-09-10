import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import { en } from "@/i18n/locales/en";
import { tr } from "@/i18n/locales/tr";

const resources = {
  en: {
    translation: en,
  },
  tr: {
    translation: tr,
  },
};

void i18n.use(initReactI18next).init({
  resources,
  lng: "tr",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export { i18n };

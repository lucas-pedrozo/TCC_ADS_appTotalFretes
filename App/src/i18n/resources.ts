import { translationPT, translationEN } from "./constants";

export const resources = {
  pt: {
    translation: translationPT,
  },
  en: {
    translation: translationEN,
  },
} as const;

export type AppLanguage = keyof typeof resources;

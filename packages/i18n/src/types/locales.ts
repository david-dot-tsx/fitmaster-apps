export const LOCALES = {
  PL: "pl",
  EN: "en",
  ES: "es",
} as const;
export type Locale = (typeof LOCALES)[keyof typeof LOCALES];

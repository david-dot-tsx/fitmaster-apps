export const DATE_FORMATS = {
  DATE: "dd/MM/yyyy",
  DATETIME: "dd/MM/yyyy HH:mm",
  TIME: "HH:mm",
} as const;

export type DateFormats = (typeof DATE_FORMATS)[keyof typeof DATE_FORMATS];

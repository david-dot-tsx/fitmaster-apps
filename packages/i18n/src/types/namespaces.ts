export const NAMESPACES_KEYS = {
  COMMON: "COMMON",
  API_ERRORS: "API_ERRORS",
  MOBILE: "MOBILE",
  WEB: "WEB",
} as const;

export const NAMESPACES = {
  [NAMESPACES_KEYS.COMMON]: "common",
  [NAMESPACES_KEYS.API_ERRORS]: "api-errors",
  [NAMESPACES_KEYS.MOBILE]: "mobile",
  [NAMESPACES_KEYS.WEB]: "web",
} as const;
export type Namespace = (typeof NAMESPACES)[keyof typeof NAMESPACES];

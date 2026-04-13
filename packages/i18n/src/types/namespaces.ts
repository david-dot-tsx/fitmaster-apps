export const NAMESPACES = {
  COMMON: "common",
  API_ERRORS: "api-errors",
  MOBILE: "mobile",
  WEB: "web",
} as const;
export type Namespace = (typeof NAMESPACES)[keyof typeof NAMESPACES];

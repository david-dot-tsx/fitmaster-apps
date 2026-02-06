import z from "zod";

export const API_HEADERS_KEYS = {
  X_DEVICE_NAME: "x-device-name",
  X_DEVICE_OS: "x-device-os",
  X_CLIENT_TYPE: "x-device-type",
  AUTHORIZATION: "authorization",
} as const;

export const API_HEADER_X_CLIENT_TYPES_VALUES = {
  MOBILE: "mobile",
  WEB: "web",
  OTHER: "other",
} as const;

export const deviceTypeSchema = z.enum(API_HEADER_X_CLIENT_TYPES_VALUES);
export type DeviceType = z.infer<typeof deviceTypeSchema>;

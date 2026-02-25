import apiErrors from "../locales/pl/api-errors.json";
import type Resources from "../resources";
import { NAMESPACES } from "../types/namespaces";

type ApiErrorKeyInI18nResources = keyof Resources["api-errors"];

const isApiErrorKeyInI18nResources = (key: unknown): key is ApiErrorKeyInI18nResources => {
  return typeof key === "string" && Object.prototype.hasOwnProperty.call(apiErrors, key);
};

type ApiErrorNamespacedTranslationKey =
  `${typeof NAMESPACES.API_ERRORS}:${ApiErrorKeyInI18nResources}`;

export const getApiErrorNamespacedTranslationKey = (
  errorMessage: unknown,
): ApiErrorNamespacedTranslationKey | null => {
  if (!isApiErrorKeyInI18nResources(errorMessage)) {
    return null;
  }

  return `${NAMESPACES.API_ERRORS}:${errorMessage}`;
};

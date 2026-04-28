import { getTKey, I18N_NAMESPACES } from "@repo/i18n/web";
import { API_PROCEDURE_ERRORS } from "@repo/api/client";

import { useT } from "@/lib/i18n/i18n";

interface handleApiErrorMessageOptions {
  onMatch?: Partial<Record<keyof typeof API_PROCEDURE_ERRORS, (translatedMessage: string) => void>>;
  default?: (translatedMessage: string) => void;
}

const API_ERROR_TRANSLATION_KEYS = {
  [API_PROCEDURE_ERRORS.INVALID_CREDENTIALS]: getTKey("api-errors:INVALID_CREDENTIALS"),
  [API_PROCEDURE_ERRORS.USER_ALREADY_EXISTS]: getTKey("api-errors:USER_ALREADY_EXISTS"),
  [API_PROCEDURE_ERRORS.PUBLISHED_TRAINING_WITHOUT_DAYS]: getTKey(
    "api-errors:PUBLISHED_TRAINING_WITHOUT_DAYS",
  ),
} as const;

export const useHandleApiErrorMessage = () => {
  const { t } = useT([I18N_NAMESPACES.API_ERRORS]);

  const handleApiErrorMessage = (
    errorMessage?: string,
    options?: handleApiErrorMessageOptions,
  ): string | null => {
    const translationKey = errorMessage
      ? API_ERROR_TRANSLATION_KEYS[errorMessage as keyof typeof API_ERROR_TRANSLATION_KEYS]
      : undefined;

    const translatedMessage = translationKey ? t(translationKey) : t("errors.generic.description");

    if (translationKey && errorMessage) {
      const matchedFn = options?.onMatch?.[errorMessage as keyof typeof API_PROCEDURE_ERRORS];
      (matchedFn ?? options?.default)?.(translatedMessage);

      return translatedMessage;
    }

    options?.default?.(translatedMessage);

    return translatedMessage;
  };

  return { handleApiErrorMessage };
};

import { Controller, useFormContext } from "react-hook-form";
import { cn } from "@gluestack-ui/utils/nativewind-utils";
import { type ResourceKey } from "i18next";
import { useTranslation } from "react-i18next";
import React from "react";

import { NAMESPACES } from "@repo/i18n/mobile";

import {
  FormControl,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
  FormControlLabel,
  FormControlLabelText,
} from "@/components/ui/form-control";
import { AlertCircleIcon, CircleIcon } from "@/components/ui/icon";
import { Radio, RadioGroup, RadioIcon, RadioIndicator, RadioLabel } from "@/components/ui/radio";

export interface FormRadioProps {
  name: string;
  label: string;
  options: { label: ResourceKey; value: string }[];
}

export const FormRadio = ({ name, label, options }: FormRadioProps) => {
  const { control } = useFormContext();
  const { t } = useTranslation([NAMESPACES.COMMON, NAMESPACES.MOBILE]);

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormControl isInvalid={Boolean(fieldState.error)}>
          <FormControlLabel>
            <FormControlLabelText
              className={cn("font-normal capitalize tracking-widest text-white")}
            >
              {label}
            </FormControlLabelText>
          </FormControlLabel>
          <RadioGroup value={field.value} onChange={field.onChange}>
            {options.map((option) => (
              <Radio
                value={option.value}
                size="lg"
                isInvalid={false}
                isDisabled={false}
                key={option.value}
              >
                <RadioIndicator>
                  <RadioIcon as={CircleIcon} className="fill-amber-400  text-amber-400" />
                </RadioIndicator>
                <RadioLabel>{t(option.label)}</RadioLabel>
              </Radio>
            ))}
          </RadioGroup>
          <FormControlError className="mt-2">
            <FormControlErrorIcon as={AlertCircleIcon} className="mr-0.5" />
            <FormControlErrorText>{fieldState.error?.message}</FormControlErrorText>
          </FormControlError>
        </FormControl>
      )}
    />
  );
};

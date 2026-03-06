import React from "react";
import { Controller, useFormContext } from "react-hook-form";

import { WheelPicker, type WheelPickerProps } from "@/components/ui/wheel-picker";
import {
  FormControl,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
  FormControlLabel,
  FormControlLabelText,
} from "@/components/ui/form-control";
import { AlertCircleIcon } from "@/components/ui/icon";

interface FormWheelPickerProps extends Omit<WheelPickerProps, "value" | "onValueChanged"> {
  name: string;
  label?: string;
  value?: number;
}

export const FormWheelPicker = ({ name, label, ...rest }: FormWheelPickerProps) => {
  const { control } = useFormContext();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormControl isInvalid={Boolean(fieldState.error)}>
          {label && (
            <FormControlLabel>
              <FormControlLabelText className="ml-3 text-center font-normal tracking-widest text-white">
                {label}
              </FormControlLabelText>
            </FormControlLabel>
          )}
          <WheelPicker {...rest} value={field.value} onValueChanged={field.onChange} />
          <FormControlError>
            <FormControlErrorIcon as={AlertCircleIcon} className="mr-0.5" />
            <FormControlErrorText>{fieldState.error?.message}</FormControlErrorText>
          </FormControlError>
        </FormControl>
      )}
    />
  );
};

import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { View } from "react-native";

import {
  FormControl,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
  FormControlLabel,
  FormControlLabelText,
} from "@/components/ui/form-control";
import { AlertCircleIcon } from "@/components/ui/icon";
import { WheelPickerDate } from "@/components/ui/wheel-picker-date";

interface FormWheelPickerDateProps {
  name: string;
  label?: string;
  className?: string;
}

export const FormWheelPickerDate = ({ name, label, className }: FormWheelPickerDateProps) => {
  const { control } = useFormContext();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <View className={className}>
          <FormControl isInvalid={Boolean(fieldState.error)}>
            {label && (
              <FormControlLabel>
                <FormControlLabelText className="ml-3 text-center font-normal tracking-widest text-white">
                  {label}
                </FormControlLabelText>
              </FormControlLabel>
            )}
            <WheelPickerDate value={field.value ?? new Date()} onValueChanged={field.onChange} />
            <FormControlError>
              <FormControlErrorIcon as={AlertCircleIcon} className="mr-0.5" />
              <FormControlErrorText>{fieldState.error?.message}</FormControlErrorText>
            </FormControlError>
          </FormControl>
        </View>
      )}
    />
  );
};

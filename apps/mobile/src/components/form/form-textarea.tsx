import React from "react";
import { TextInput, View, Text } from "react-native";
import { Controller, useFormContext } from "react-hook-form";
import { cn } from "@gluestack-ui/utils/nativewind-utils";

import {
  FormControl,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
  FormControlLabel,
  FormControlLabelText,
} from "@/components/ui/form-control";
import { AlertCircleIcon } from "@/components/ui/icon";

export interface FormTextareaProps extends React.ComponentProps<typeof TextInput> {
  name: string;
  label: string;
  placeholder?: string;
  maxLength?: number;
}

export const FormTextarea = ({
  name,
  label,
  placeholder,
  maxLength = 200,
  className,
  ...props
}: FormTextareaProps) => {
  const { control } = useFormContext();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const charCount = (field.value as string | undefined)?.length ?? 0;
        const isNearLimit = charCount >= maxLength * 0.85;
        const isAtLimit = charCount >= maxLength;

        return (
          <FormControl isInvalid={Boolean(fieldState.error)} className="w-full">
            <FormControlLabel>
              <FormControlLabelText className="font-normal tracking-widest text-white">
                {label}
              </FormControlLabelText>
            </FormControlLabel>

            <View
              className={cn(
                "rounded border border-zinc-800 bg-transparent p-3",
                fieldState.error && "border-error-700",
                !fieldState.error && "focus-within:border-amber-400",
              )}
            >
              <TextInput
                value={field.value ?? ""}
                onChangeText={field.onChange}
                onBlur={field.onBlur}
                placeholder={placeholder}
                placeholderTextColor="#71717a"
                multiline
                textAlignVertical="top"
                maxLength={maxLength}
                keyboardType="default"
                className={cn("min-h-[120px] text-base text-zinc-100", className)}
                {...props}
              />

              <Text
                className={cn(
                  "mt-1 self-end text-xs",
                  { "text-amber-400": isNearLimit },
                  { "text-error-500": isAtLimit },
                )}
              >
                {charCount}/{maxLength}
              </Text>
            </View>

            <FormControlError>
              <FormControlErrorIcon as={AlertCircleIcon} className="mr-0.5" />
              <FormControlErrorText>{fieldState.error?.message}</FormControlErrorText>
            </FormControlError>
          </FormControl>
        );
      }}
    />
  );
};

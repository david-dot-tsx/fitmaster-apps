import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import {
  TextInput as RNTextInput,
  type TextInputProps as RNTextInputProps,
  Text,
} from "react-native";

interface InputTextProps extends RNTextInputProps {
  placeholder?: string;
  name: string;
}

export const InputText = ({ name, placeholder, ...props }: InputTextProps) => {
  const { control } = useFormContext();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { value, onChange }, fieldState: { error } }) => (
        <>
          <RNTextInput
            value={value}
            onChangeText={onChange}
            placeholder={placeholder}
            placeholderTextColor="#94a3b8"
            className="w-full rounded-lg border border-slate-600 text-center text-lg text-slate-100"
            {...props}
          />
          {error && <Text className="text-red-500">{error.message}</Text>}
        </>
      )}
    />
  );
};

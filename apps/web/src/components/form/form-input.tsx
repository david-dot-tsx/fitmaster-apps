import React from "react";
import { Controller, useFormContext } from "react-hook-form";

import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

interface FormInputProps {
  name: string;
  label: string;
  placeholder?: string;
  type?: React.HTMLInputTypeAttribute;
}
export const FormInput = ({ name, label, placeholder, type }: FormInputProps) => {
  const { control } = useFormContext();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={name}>{label}</FieldLabel>
          <Input {...field} placeholder={placeholder} id={name} type={type} />
          {fieldState.error && <FieldError>{fieldState.error.message}</FieldError>}
        </Field>
      )}
    />
  );
};

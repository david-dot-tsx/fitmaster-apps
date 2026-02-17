import React from "react";
import { Controller, useFormContext } from "react-hook-form";

import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { InputNumber, type InputNumberProps } from "@/components/ui/input-number";

interface FormInputNumberProps extends InputNumberProps {
  name: string;
  label: string;
}
export const FormInputNumber = ({ name, label, ...props }: FormInputNumberProps) => {
  const { control, trigger } = useFormContext();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, ...field }, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={name}>{label}</FieldLabel>
          <InputNumber
            {...field}
            {...props}
            onValueChange={(values) => {
              onChange(values.floatValue ?? null);
              //Required to trigger revalidation in array fields
              if (fieldState.error) {
                trigger(name);
              }
            }}
            id={field.name}
          />
          {fieldState.error && <FieldError>{fieldState.error.message}</FieldError>}
        </Field>
      )}
    />
  );
};

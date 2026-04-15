import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { type SelectProps, type SelectItemProps } from "@radix-ui/react-select";

import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type SelectOption = SelectItemProps;

interface FormSelectProps extends SelectProps {
  name: string;
  label: string;
  placeholder?: string;
  options: SelectOption[];
}
export const FormSelect = ({ name, label, placeholder, options, ...rest }: FormSelectProps) => {
  const { control, trigger } = useFormContext();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={name}>{label}</FieldLabel>
          <Select
            onValueChange={(value) => {
              field.onChange(value);
              field.onBlur();
              //Required to trigger revalidation in array fields
              if (fieldState.error) {
                trigger(name);
              }
            }}
            {...field}
            {...rest}
            name={field.name}
            value={field.value ?? undefined}
          >
            <SelectTrigger>
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.children}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          {fieldState.error && <FieldError>{fieldState.error.message}</FieldError>}
        </Field>
      )}
    />
  );
};

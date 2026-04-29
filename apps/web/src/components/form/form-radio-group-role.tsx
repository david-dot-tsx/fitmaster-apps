"use client";

import React from "react";
import { Controller, useFormContext } from "react-hook-form";

import { Role, type UserCreateInputForm } from "@repo/validators";

import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface FormRadioGroupRoleProps {
  name: "role";
  label: string;
  customerLabel?: string;
  trainerLabel?: string;
}

export const FormRadioGroupRole = ({
  name,
  label,
  customerLabel = "Customer",
  trainerLabel = "Trainer",
}: FormRadioGroupRoleProps) => {
  const { control } = useFormContext<UserCreateInputForm>();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
          <RadioGroup
            id={field.name}
            value={field.value}
            onValueChange={field.onChange}
            className="grid grid-cols-2 gap-2"
          >
            <FieldLabel
              htmlFor="role-customer"
              className="border-zinc-800 bg-zinc-900/50 text-zinc-300 has-data-[state=checked]:border-amber-400 has-data-[state=checked]:bg-amber-400/10 has-data-[state=checked]:text-amber-400"
            >
              <RadioGroupItem
                id="role-customer"
                value={Role.CUSTOMER}
                className="border-zinc-600 text-amber-400"
              />
              {customerLabel}
            </FieldLabel>
            <FieldLabel
              htmlFor="role-trainer"
              className="border-zinc-800 bg-zinc-900/50 text-zinc-300 has-data-[state=checked]:border-amber-400 has-data-[state=checked]:bg-amber-400/10 has-data-[state=checked]:text-amber-400"
            >
              <RadioGroupItem
                id="role-trainer"
                value={Role.TRAINER}
                className="border-zinc-600 text-amber-400"
              />
              {trainerLabel}
            </FieldLabel>
          </RadioGroup>
          {fieldState.error && <FieldError>{fieldState.error.message}</FieldError>}
        </Field>
      )}
    />
  );
};

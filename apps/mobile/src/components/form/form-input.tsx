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
import { InputField, Input } from "@/components/ui/input";
import { AlertCircleIcon } from "@/components/ui/icon";

export interface FormInputProps extends React.ComponentProps<typeof InputField> {
  name: string;
  label: string;
  placeholder: string;
}
export const FormInput = ({
  name,
  label,
  textContentType = "none",
  className,
  ...props
}: FormInputProps) => {
  const { control } = useFormContext();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormControl isInvalid={Boolean(fieldState.error)}>
          <FormControlLabel>
            <FormControlLabelText className={"font-normal tracking-widest text-white"}>
              {label}
            </FormControlLabelText>
          </FormControlLabel>
          <Input className={"border border-zinc-800 data-[focus=true]:border-amber-400"}>
            <InputField
              value={field.value ?? ""}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              placeholderTextColor="#71717a"
              autoCapitalize="none"
              autoCorrect={false}
              textContentType={textContentType}
              className={cn("text-zinc-100", className)}
              {...props}
            />
          </Input>
          <FormControlError>
            <FormControlErrorIcon as={AlertCircleIcon} className="mr-0.5" />
            <FormControlErrorText>{fieldState.error?.message}</FormControlErrorText>
          </FormControlError>
        </FormControl>
      )}
    />
  );
};

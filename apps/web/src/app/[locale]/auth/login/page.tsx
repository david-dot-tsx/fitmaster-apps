"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

import { authLoginInputSchema, AuthProcedureErrors, type AuthLoginInput } from "@repo/validators";

import { PageWrapper } from "@/components/layout/page-wrapper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/form/form-input";
import { LocaleSwitch } from "@/components/locale-switch";

export default function LoginPage() {
  const { t } = useTranslation(["translations", "validations"]);
  const router = useRouter();
  const methods = useForm<AuthLoginInput>({
    resolver: zodResolver(authLoginInputSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // TODO: Tanstack query: To refactor to queryfactory
  const loginMutation = useMutation({
    mutationFn: async (credentials: AuthLoginInput) => {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(credentials),
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        const errorData = await res.json();
        if (errorData.error.message === AuthProcedureErrors.INVALID_CREDENTIALS) {
          methods.setError("email", { message: errorData.error.message });
        }
        throw new Error(errorData.message);
      }

      return res.json();
    },
    onSuccess: () => {
      router.push("/dashboard");
      router.refresh();
    },
  });

  return (
    <PageWrapper className="mt-12">
      <LocaleSwitch />
      <Card className="w-full max-w-xs">
        <CardHeader>
          <CardTitle className="bg-popover text-2xl font-bold text-amber-400">Login</CardTitle>
        </CardHeader>
        <CardContent>
          <FormProvider {...methods}>
            {/* <p>{t("validations.validation_error")}</p> */}
            <p>{t("interpolation", { name: "John" })}</p>
            <p>{t("content.part_1")}</p>
            <p>{t("validations:validation_error")}</p>
            <p>{t("description")}</p>
            <p>{t("validations:validation_error_2")}</p>
            <p>{t("content.part_2")}</p>
            <form className="flex flex-col gap-4">
              <FormInput name="email" label="Email" placeholder="Email" />
              <FormInput name="password" label="Password" placeholder="Password" type="password" />
              <Button
                className="mt-2"
                onClick={methods.handleSubmit((data) =>
                  loginMutation.mutate({ email: data.email, password: data.password }),
                )}
              >
                Login
              </Button>
            </form>
          </FormProvider>
        </CardContent>
      </Card>
    </PageWrapper>
  );
}

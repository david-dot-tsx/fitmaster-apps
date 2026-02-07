"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

import { userCreateInputFormSchema, type UserCreateInputForm } from "@repo/validators";
import { getApiErrorNamespacedTranslationKey, NAMESPACES } from "@repo/i18n/web";

import { useTRPC } from "@/lib/trpc/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageWrapper } from "@/components/layout/page-wrapper";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/form/form-input";

export default function RegisterPage() {
  const trpc = useTRPC();
  const { t } = useTranslation([NAMESPACES.COMMON, NAMESPACES.API_ERRORS]);
  const methods = useForm<UserCreateInputForm>({
    resolver: zodResolver(userCreateInputFormSchema),
    defaultValues: {
      email: "",
      password: "",
      passwordConfirmation: "",
    },
  });

  const registerMutation = useMutation(
    trpc.user.create.mutationOptions({
      onSuccess: () => {
        alert("Registered!");
      },
      onError: (err) => {
        const apiErrorTranslationKey = getApiErrorNamespacedTranslationKey(err.message);
        if (apiErrorTranslationKey) {
          methods.setError("email", { message: t(apiErrorTranslationKey) });
        }
      },
    }),
  );

  return (
    <PageWrapper className="mt-12">
      <Card className="w-full max-w-xs">
        <CardHeader>
          <CardTitle className="bg-popover text-2xl font-bold text-amber-400">
            {t("register")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <FormProvider {...methods}>
            <form className="flex flex-col gap-4">
              <FormInput name="email" label={t("email")} placeholder={t("email")} />
              <FormInput name="password" label={t("password")} type="password" />

              <FormInput
                name="passwordConfirmation"
                label={t("password_confirmation")}
                type="password"
              />
              <Button
                className="mt-2"
                onClick={methods.handleSubmit((data) =>
                  registerMutation.mutate({ email: data.email, password: data.password }),
                )}
              >
                {t("register")}
              </Button>
            </form>
          </FormProvider>
        </CardContent>
      </Card>
    </PageWrapper>
  );
}

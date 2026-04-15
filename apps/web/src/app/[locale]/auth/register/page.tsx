"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { toast } from "sonner";

import { userCreateInputFormSchema, type UserCreateInputForm } from "@repo/validators";
import { I18N_NAMESPACES } from "@repo/i18n/web";
import { API_PROCEDURE_ERRORS } from "@repo/api/client";

import { useT } from "@/lib/i18n/i18n";
import { useTRPC } from "@/lib/trpc/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageWrapper } from "@/components/layout/page-wrapper";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/form/form-input";
import { useApiErrorTranslatedMessage } from "@/hooks/use-api-error-translated-message";

export default function RegisterPage() {
  const { getApiErrorTranslatedMessage } = useApiErrorTranslatedMessage();
  const trpc = useTRPC();
  const { t } = useT([I18N_NAMESPACES.API_ERRORS]);
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
        toast.success(t("success.generic.description"));
      },
      onError: (error) => {
        getApiErrorTranslatedMessage(error.message, {
          onMatch: {
            [API_PROCEDURE_ERRORS.USER_ALREADY_EXISTS]: (translatedMessage: string) => {
              methods.setError("email", { message: translatedMessage });
              toast.error(translatedMessage);
            },
          },
          default: (translatedMessage: string) => {
            toast.error(translatedMessage);
          },
        });
      },
    }),
  );

  return (
    <PageWrapper
      title={t("web:pages.register.title")}
      subtitle={t("web:pages.register.subtitle")}
      eyebrow={t("web:pages.register.eyebrow")}
    >
      <div className="group m-auto max-w-md">
        <Card className="relative overflow-hidden border-zinc-900 bg-zinc-950/50 backdrop-blur-md transition-all duration-700 ease-out group-hover:border-amber-400/30 group-hover:shadow-[0_0_50px_rgba(251,191,36,0.05)]">
          <div className="absolute left-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-amber-400/50 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

          <CardHeader className="space-y-1">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-black uppercase tracking-[0.3em] text-zinc-500 transition-colors group-hover:text-amber-400">
                {t("register")}
              </CardTitle>
            </div>
          </CardHeader>

          <CardContent>
            <FormProvider {...methods}>
              <form
                className="flex flex-col gap-6 px-8"
                onSubmit={methods.handleSubmit((data) => registerMutation.mutate(data))}
              >
                <div className="space-y-4">
                  <FormInput
                    name="email"
                    label={t("email")}
                    placeholder="user@system.com"
                    className="border-zinc-800 bg-zinc-900/50 text-zinc-100 transition-all focus:border-amber-400/50"
                  />
                  <FormInput
                    name="password"
                    label={t("password")}
                    type="password"
                    className="border-zinc-800 bg-zinc-900/50 text-zinc-100 transition-all focus:border-amber-400/50"
                  />
                  <FormInput
                    name="passwordConfirmation"
                    label={t("passwordConfirmation")}
                    type="password"
                    className="border-zinc-800 bg-zinc-900/50 text-zinc-100 transition-all focus:border-amber-400/50"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={registerMutation.isPending}
                  className="relative mt-4 w-full overflow-hidden rounded-none border-t border-amber-400/20 bg-zinc-900 py-6 font-black uppercase tracking-widest text-zinc-400 transition-all duration-300 hover:bg-amber-400 hover:text-black hover:shadow-[0_0_20px_rgba(251,191,36,0.4)] disabled:opacity-20"
                >
                  {registerMutation.isPending ? `${t("processing")}...` : t("register")}
                </Button>
              </form>
            </FormProvider>

            <div className="mt-10 flex flex-col items-center gap-3">
              <Link
                href="/auth/login"
                className="text-xs uppercase tracking-widest text-zinc-500 transition-colors hover:text-zinc-300"
              >
                {t("web:pages.register.existingProfileLogIn")}
              </Link>

              <div className="mt-2 flex gap-1">
                <div className="h-1 w-8 bg-amber-400/20" />
                <div className="h-1 w-2 bg-amber-400/40" />
                <div className="size-1 bg-amber-400/60" />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mx-auto h-1 w-4/5 bg-amber-400/10 opacity-0 blur-xl transition-opacity duration-1000 group-hover:opacity-100" />
      </div>
    </PageWrapper>
  );
}

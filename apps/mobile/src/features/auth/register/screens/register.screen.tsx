import React from "react";
import { KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { router } from "expo-router";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserPlus } from "lucide-react-native";

import { type UserCreateInputForm, userCreateInputFormSchema } from "@repo/validators";

import { useT } from "@/lib/i18n";
import { trpc } from "@/lib/trpc/client";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Link, LinkText } from "@/components/ui/link";
import { Button, ButtonText } from "@/components/ui/button";
import { ScreenWrapper } from "@/components/layout/screen-wrapper";
import { Section } from "@/components/ui/section";
import { FormInput } from "@/components/form/form-input";
import { useToastNotification } from "@/components/modules/toast-notifcation/toast-notification";

export const RegisterScreen = () => {
  const { t } = useT();
  const { openToast } = useToastNotification();
  const { mutate: mutateRegister, status: registerStatus } = trpc.user.create.useMutation({
    onSuccess: () => {
      router.push("/auth/login");
    },
    onError: (_error) => {
      openToast({
        title: "Register Failed",
        description: "Something went wrong. Try again later.",
        action: "error",
      });
    },
  });

  const methods = useForm<UserCreateInputForm>({
    resolver: zodResolver(userCreateInputFormSchema),
    defaultValues: {
      email: "",
      password: "",
      passwordConfirmation: "",
    },
    disabled: registerStatus === "pending",
  });

  return (
    <ScreenWrapper
      header={{
        title: t("mobile:screens.register.title"),
        description: t("mobile:screens.register.description"),
        subtitle: t("mobile:screens.register.subtitle"),
        icon: UserPlus,
      }}
    >
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 40, paddingTop: 8 }}
        >
          <VStack className="gap-6 px-4">
            <Section title="Your details">
              <VStack className="gap-4 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5">
                <FormProvider {...methods}>
                  <FormInput
                    name="email"
                    label={t("email")}
                    placeholder={t("emailAddress")}
                    textContentType="emailAddress"
                    keyboardType="email-address"
                  />
                  <FormInput
                    name="password"
                    label={t("password")}
                    placeholder={t("password")}
                    secureTextEntry
                    textContentType="password"
                  />
                  <FormInput
                    name="passwordConfirmation"
                    label={t("passwordConfirmation")}
                    placeholder={t("passwordConfirmation")}
                    secureTextEntry
                    textContentType="password"
                  />
                  <Button
                    action="primary"
                    onPress={methods.handleSubmit((data) => mutateRegister(data))}
                  >
                    <ButtonText className="font-semibold text-zinc-950">{t("register")}</ButtonText>
                  </Button>
                </FormProvider>
              </VStack>
            </Section>
            <HStack className="flex-wrap justify-between gap-2">
              <Link onPress={() => router.push("/auth/login")}>
                <LinkText className="text-2xs uppercase tracking-[0.18em] text-zinc-500">
                  {t("login")}
                </LinkText>
              </Link>
              <Link onPress={() => router.push("/auth/forgot-password")}>
                <LinkText className="text-2xs uppercase tracking-[0.18em] text-zinc-400">
                  {t("forgot_password")}
                </LinkText>
              </Link>
            </HStack>
          </VStack>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
};

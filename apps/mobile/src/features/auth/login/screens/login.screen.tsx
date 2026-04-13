import React from "react";
import { KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { router } from "expo-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { LogIn } from "lucide-react-native";
import { useTranslation } from "react-i18next";

import { authLoginInputSchema, type AuthLoginInput } from "@repo/validators";
import { NAMESPACES } from "@repo/i18n/mobile";

import { useAuthContext } from "@/providers/auth/auth-context";
import { FormInput } from "@/components/form/form-input";
import { ScreenWrapper } from "@/components/layout/screen-wrapper";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Button, ButtonText } from "@/components/ui/button";
import { Link, LinkText } from "@/components/ui/link";
import { Section } from "@/components/ui/section";

export const LoginScreen = () => {
  const { login, loginStatus } = useAuthContext();
  const { t } = useTranslation([NAMESPACES.COMMON, NAMESPACES.MOBILE]);
  const methods = useForm<AuthLoginInput>({
    resolver: zodResolver(authLoginInputSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    disabled: loginStatus === "pending",
  });

  return (
    <ScreenWrapper
      header={{
        title: t("mobile:screens.login.title"),
        description: t("mobile:screens.login.description"),
        subtitle: t("mobile:screens.login.subtitle"),
        icon: LogIn,
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
            <Section title={t("mobile:screens.login.credentials")}>
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
                  <Button action="primary" onPress={methods.handleSubmit(login)}>
                    <ButtonText className="font-semibold text-zinc-950">{t("login")}</ButtonText>
                  </Button>
                </FormProvider>
              </VStack>
            </Section>
            <HStack className="flex-wrap justify-between gap-2">
              <Link onPress={() => router.push("/auth/register")}>
                <LinkText className="text-2xs uppercase tracking-[0.18em] text-zinc-500">
                  {t("register")}
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

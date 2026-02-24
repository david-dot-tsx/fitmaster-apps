import React from "react";
import { KeyboardAvoidingView, Platform } from "react-native";
import { router } from "expo-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { cn } from "@gluestack-ui/utils/nativewind-utils";

import { authLoginInputSchema, type AuthLoginInput } from "@repo/validators";
import { NAMESPACES } from "@repo/i18n/mobile";

import { useAuthContext } from "@/providers/auth/auth-context";
import { FormInput } from "@/components/form/form-input";
import { ScreenWrapper } from "@/components/layout/screen-wrapper";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Button, ButtonText } from "@/components/ui/button";
import { Link, LinkText } from "@/components/ui/link";
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";

const LoginScreen = () => {
  const { login, loginStatus } = useAuthContext();
  const { t } = useTranslation([NAMESPACES.COMMON]);
  const methods = useForm<AuthLoginInput>({
    resolver: zodResolver(authLoginInputSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    disabled: loginStatus === "pending",
  });

  return (
    <ScreenWrapper>
      <KeyboardAvoidingView
        className="flex flex-1 justify-center"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <Card className={cn("gap-4", "border border-amber-400/30 bg-zinc-950 opacity-70")}>
          <Heading className="space-y-1 font-black uppercase tracking-[0.2em] text-amber-400">
            {t("login")}
          </Heading>
          <VStack className="gap-4">
            <FormProvider {...methods}>
              <FormInput
                name="email"
                label="Email"
                placeholder="Email Address"
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

              <Button onPress={methods.handleSubmit(login)}>
                <ButtonText>Login</ButtonText>
              </Button>
            </FormProvider>
            <HStack className="flex-wrap justify-between">
              <Link onPress={() => router.push("/auth/register")}>
                <LinkText className="text-2xs uppercase tracking-[2px] text-zinc-500">
                  {t("register")}
                </LinkText>
              </Link>
              <Link onPress={() => router.push("/auth/forgot-password")}>
                <LinkText className="text-2xs uppercase tracking-[2px] text-zinc-700">
                  {t("forgot_password")}
                </LinkText>
              </Link>
            </HStack>
          </VStack>
        </Card>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
};

export default LoginScreen;

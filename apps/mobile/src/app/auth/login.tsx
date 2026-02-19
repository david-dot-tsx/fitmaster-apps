import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { router } from "expo-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { authLoginInputSchema, type AuthLoginInput } from "@repo/validators";
import { NAMESPACES } from "@repo/i18n/mobile";

import { InputText } from "@/components/form/input-text";
import { Button } from "@/components/ui/button";
import { useAuthContext } from "@/providers/auth/auth-context";
import { LanguagePicker } from "@/components/ui/language-picker";

const LoginScreen = () => {
  const { login, loginStatus } = useAuthContext();
  const { t } = useTranslation([NAMESPACES.COMMON]);
  const form = useForm<AuthLoginInput>({
    resolver: zodResolver(authLoginInputSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    disabled: loginStatus === "pending",
  });

  return (
    <View className="flex-1 items-center justify-center bg-sky-600">
      <Text className="text-4xl font-bold text-slate-950">{t("login")}</Text>
      <View className="flex w-full flex-col gap-4 p-4">
        <FormProvider {...form}>
          <InputText name="email" placeholder={t("email")} />
          <InputText name="password" placeholder={t("password")} />
          <Button onPress={form.handleSubmit(login)}>
            <Text className="text-center text-2xl font-bold text-slate-300">{t("login")}</Text>
          </Button>
        </FormProvider>
      </View>
      <TouchableOpacity onPress={() => router.push("/auth/register")}>
        <Text className="text-slate-300">{t("register")}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push("/auth/forgot-password")}>
        <Text className="text-slate-300">{t("forgot_password")}</Text>
      </TouchableOpacity>
      <LanguagePicker />
    </View>
  );
};

export default LoginScreen;

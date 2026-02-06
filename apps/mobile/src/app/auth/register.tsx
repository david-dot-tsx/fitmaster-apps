import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { router } from "expo-router";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";

import { userCreateInputSchema, type UserCreateInput } from "@repo/validators";
import { NAMESPACES } from "@repo/i18n/mobile";

import { trpc } from "@/lib/trpc/client";
import { InputText } from "@/components/form/input-text";
import { Button } from "@/components/ui/button";
import { LanguagePicker } from "@/components/ui/language-picker";
const RegisterScreen = () => {
  const { t } = useTranslation([NAMESPACES.COMMON]);
  const { mutate: mutateRegister, status: registerStatus } = trpc.user.create.useMutation({
    onSuccess: () => {
      router.push("/auth/login");
    },
  });
  const form = useForm<UserCreateInput>({
    resolver: zodResolver(userCreateInputSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    disabled: registerStatus === "pending",
  });

  return (
    <View className="flex-1 items-center justify-center bg-sky-600">
      <Text className="text-4xl font-bold text-slate-950">{t("register")}</Text>
      <View className="flex w-full flex-col gap-4 p-4">
        <FormProvider {...form}>
          <InputText name="email" placeholder={t("email")} />
          <InputText name="password" placeholder={t("password")} />
          <Button
            onPress={form.handleSubmit((data) =>
              mutateRegister({ email: data.email, password: data.password }),
            )}
          >
            <Text className="text-center text-2xl font-bold text-slate-300">{t("register")}</Text>
          </Button>
        </FormProvider>
      </View>
      <TouchableOpacity onPress={() => router.push("/auth/login")}>
        <Text className="text-slate-300">{t("login")}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push("/auth/forgot-password")}>
        <Text className="text-slate-300">{t("forgot_password")}</Text>
      </TouchableOpacity>
      <LanguagePicker />
    </View>
  );
};

export default RegisterScreen;

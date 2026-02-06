import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { router } from "expo-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";

import { authLoginInputSchema, type AuthLoginInput } from "@repo/validators";

import { InputText } from "@/components/form/input-text";
import { Button } from "@/components/ui/button";
import { useAuthContext } from "@/providers/auth/auth-context";

const LoginScreen = () => {
  const { login, loginStatus } = useAuthContext();
  const form = useForm<AuthLoginInput>({
    resolver: zodResolver(authLoginInputSchema),
    defaultValues: {
      email: "admin@test.dev",
      password: "123",
    },
    disabled: loginStatus === "pending",
  });

  return (
    <View className="flex-1 items-center justify-center bg-sky-600">
      <Text className="text-4xl font-bold text-slate-950">Login Screen</Text>
      <View className="flex w-full flex-col gap-4 p-4">
        <FormProvider {...form}>
          <InputText name="email" placeholder="Email" />
          <InputText name="password" placeholder="Password" />
          <Button onPress={form.handleSubmit(login)}>
            <Text className="text-center text-2xl font-bold text-slate-300">Login</Text>
          </Button>
        </FormProvider>
      </View>
      <TouchableOpacity onPress={() => router.push("/auth/register")}>
        <Text className="text-slate-300">Register</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push("/auth/forgot-password")}>
        <Text className="text-slate-300">Forgot Password</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;

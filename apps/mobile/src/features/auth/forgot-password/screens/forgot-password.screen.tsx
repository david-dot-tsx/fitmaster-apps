import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { router } from "expo-router";

export const ForgotPasswordScreen = () => {
  return (
    <View className="flex-1 items-center justify-center bg-sky-600">
      <Text className="text-4xl font-bold text-slate-950">Forgot Password Screen</Text>
      <TouchableOpacity onPress={() => router.push("/auth/login")}>
        <Text className="text-slate-300">Login</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push("/auth/register")}>
        <Text className="text-slate-300">Register</Text>
      </TouchableOpacity>
    </View>
  );
};

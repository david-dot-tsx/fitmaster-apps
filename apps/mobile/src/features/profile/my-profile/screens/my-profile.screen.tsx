import { ScrollView, TouchableOpacity } from "react-native";
import { router } from "expo-router";

import { trpc } from "@/lib/trpc/client";
import { useAuthContext } from "@/providers/auth/auth-context";
import { useAuthStoreState } from "@/providers/auth/auth.store";
import { Button, ButtonText } from "@/components/ui/button";
import { ScreenWrapper } from "@/components/layout/screen-wrapper";
import { Text } from "@/components/ui/text";
import { Heading } from "@/components/ui/heading";

export const MyProfileScreen = () => {
  const { logout } = useAuthContext();
  const { token, refreshToken } = useAuthStoreState();
  const { data: me, refetch, isFetching } = trpc.user.me.useQuery();

  return (
    <ScreenWrapper className="pt-12">
      <ScrollView className="px-4 py-8">
        <Heading className="text-4xl font-bold text-slate-50">Hello</Heading>
        <Text>QUERY: {isFetching ? "Fetching" : "Not fetching"}</Text>
        <Text>Me: {JSON.stringify(me, null, 2)}</Text>
        <Text>Token: {token}</Text>
        <Text>RefreshToken: {refreshToken}</Text>
        <Button onPress={() => router.push("/onboarding/completed")}>
          <ButtonText>OnboardingCompletedScreen</ButtonText>
        </Button>
        <TouchableOpacity onPress={() => router.push("/onboarding")}>
          <Text className="text-center text-2xl text-slate-950">Create Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => refetch()}
          className="rounded-md bg-purple-400 p-2 font-bold text-slate-950"
        >
          <Text className="text-center text-2xl text-slate-950">Refetch Me</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => logout()}
          className="rounded-md bg-purple-400 p-2 font-bold text-slate-950"
        >
          <Text className="text-center text-2xl text-slate-950">Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </ScreenWrapper>
  );
};

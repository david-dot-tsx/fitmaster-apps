import { Image } from "expo-image";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { router } from "expo-router";

import { trpc } from "@/lib/trpc/client";
import ParallaxScrollView from "@/components/parallax-scroll-view";
import { useAuthContext } from "@/providers/auth/auth-context";
import { useAuthStoreState } from "@/providers/auth/auth.store";
import { Button, ButtonText } from "@/components/ui/button";

export default function HomeScreen() {
  const { logout } = useAuthContext();
  const { token, refreshToken } = useAuthStoreState();
  const { data: me, refetch, isFetching } = trpc.user.me.useQuery();

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={
        <Image
          source={require("@/assets/images/partial-react-logo.png")}
          style={styles.reactLogo}
        />
      }
    >
      <Text className="text-4xl font-bold text-slate-950">Hello</Text>
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
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
});

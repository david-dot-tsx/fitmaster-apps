import { Image } from "expo-image";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

import { trpc } from "@repo/api/client";

import ParallaxScrollView from "@/components/parallax-scroll-view";
import { useAuthContext } from "@/context/auth-context";

export default function HomeScreen() {
  const { login, logout, authState } = useAuthContext();
  const { data: me, refetch } = trpc.user.me.useQuery();

  /**
   * TODO: Remove POC login, with a proper login flow.
   */
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
      <TouchableOpacity onPress={() => login("user@test.dev", "123")}>
        <Text className="bg-purple-400 p-4 text-2xl font-extrabold text-slate-950">Login</Text>
      </TouchableOpacity>
      <Text>Auth State: {JSON.stringify(authState, null, 2)}</Text>
      <Text>Me: {JSON.stringify(me, null, 2)}</Text>
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

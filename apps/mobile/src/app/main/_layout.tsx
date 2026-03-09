import { Redirect, Tabs } from "expo-router";
import React from "react";
import {
  DumbbellIcon,
  HouseIcon,
  MessageCircleIcon,
  TrophyIcon,
  UserIcon,
} from "lucide-react-native";

import { HapticTab } from "@/components/haptic-tab";
import { useAuthStoreState } from "@/providers/auth/auth.store";
import { AUTH_STATUS } from "@/providers/auth/types";
import { Icon } from "@/components/ui/icon";

export default function TabLayout() {
  const { authStatus } = useAuthStoreState();

  if (authStatus === AUTH_STATUS.UNAUTHENTICATED) {
    return <Redirect href="/auth/login" />;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#fbbf24", // amber-400
        tabBarInactiveTintColor: "#52525b", // zinc-600
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: "#09090b", // zinc-950 — same as ScreenWrapper
          borderTopWidth: 1,
          borderTopColor: "#27272a", // zinc-800 — soft top border
        },
      }}
    >
      <Tabs.Screen
        name="leaderboard"
        options={{
          title: "Leaderboard",
          tabBarIcon: ({ color }) => <Icon as={TrophyIcon} size={"xl"} color={color} />,
        }}
      />
      <Tabs.Screen
        name="my-profile"
        options={{
          title: "My Profile",
          tabBarIcon: ({ color }) => <Icon as={UserIcon} size={"xl"} color={color} />,
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: "Main",
          tabBarIcon: ({ color }) => <Icon as={HouseIcon} size={"xl"} color={color} />,
        }}
      />
      <Tabs.Screen
        name="training-list"
        options={{
          title: "Trainings",
          tabBarIcon: ({ color }) => <Icon as={DumbbellIcon} size={"xl"} color={color} />,
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: "Chat",
          tabBarIcon: ({ color }) => <Icon as={MessageCircleIcon} size={"xl"} color={color} />,
        }}
      />
    </Tabs>
  );
}

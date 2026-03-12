import React from "react";
import { Pressable } from "react-native";
import { useRouter } from "expo-router";
import { ArrowLeftIcon } from "lucide-react-native";
import { cn } from "@gluestack-ui/utils/nativewind-utils";

import { Icon } from "@/components/ui/icon";

type BackButtonProps = {
  className?: string;
};

export const BackButton = ({ className }: BackButtonProps) => {
  const router = useRouter();

  return (
    <Pressable
      onPress={() => router.back()}
      className={cn("rounded-full bg-zinc-900/70 p-2", className)}
      style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
    >
      <Icon as={ArrowLeftIcon} size="md" color="#fbbf24" />
    </Pressable>
  );
};

import React from "react";
import { Image, View } from "react-native";
import { DumbbellIcon } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { cn } from "@gluestack-ui/utils/nativewind-utils";

import { Icon } from "@/components/ui/icon";

export type ContentHeroSize = "md" | "lg";

/** md = same image height as `TrainingCard` (h-56); lg = taller detail hero */
const sizeClass: Record<ContentHeroSize, string> = {
  md: "h-56",
  lg: "h-72",
};

export interface ContentHeroProps {
  imageUrl?: string | null;
  size?: ContentHeroSize;
  className?: string;
}

/**
 * Hero image matching `TrainingCard` proportions and bottom gradients (darken + amber line).
 */
export const ContentHero = ({ imageUrl, size = "md", className }: ContentHeroProps) => {
  const uri = imageUrl?.trim();
  const hasImage = Boolean(uri);

  return (
    <View
      className={cn(
        "w-full overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950",
        className,
      )}
    >
      <View className={cn("relative w-full bg-zinc-900", sizeClass[size])}>
        {hasImage && uri ? (
          <Image source={{ uri }} className="size-full" resizeMode="cover" />
        ) : (
          <View className="absolute inset-0 items-center justify-center">
            <Icon as={DumbbellIcon} size="xl" color="#52525b" />
          </View>
        )}

        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.2)", "rgba(0,0,0,0.8)"]}
          locations={[0, 0.5, 1]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          className="absolute inset-0"
        />
        <LinearGradient
          colors={[
            "transparent",
            "rgba(251,191,36,0.4)",
            "rgba(251,191,36,1)",
            "rgba(251,191,36,0.4)",
            "transparent",
          ]}
          locations={[0, 0.2, 0.5, 0.7, 1]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          className="absolute bottom-0 h-[2px] w-full rounded-lg"
        />
      </View>
    </View>
  );
};

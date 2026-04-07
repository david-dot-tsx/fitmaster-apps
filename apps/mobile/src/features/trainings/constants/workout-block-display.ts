import type { ElementType } from "react";
import { FlameIcon, SnowflakeIcon, ZapIcon } from "lucide-react-native";

export const BLOCK_ORDER = {
  WARM_UP: 1,
  MAIN_WORKOUT: 2,
  COOL_DOWN: 3,
} as const;

export type BlockType = keyof typeof BLOCK_ORDER;

export const WORKOUT_BLOCK_DISPLAY: Record<
  BlockType,
  {
    label: string;
    icon: ElementType;
    accentClass: string;
    barClass: string;
    shadowClass: string;
    pillBorderClass: string;
  }
> = {
  WARM_UP: {
    label: "Warm up",
    icon: ZapIcon,
    accentClass: "text-amber-400",
    barClass: "bg-amber-400",
    shadowClass: "shadow-amber-400/20",
    pillBorderClass: "border-amber-400/40",
  },
  MAIN_WORKOUT: {
    label: "Main workout",
    icon: FlameIcon,
    accentClass: "text-amber-500",
    barClass: "bg-amber-500",
    shadowClass: "shadow-amber-500/20",
    pillBorderClass: "border-amber-500/40",
  },
  COOL_DOWN: {
    label: "Cool down",
    icon: SnowflakeIcon,
    accentClass: "text-blue-400",
    barClass: "bg-blue-400",
    shadowClass: "shadow-blue-400/20",
    pillBorderClass: "border-blue-400/40",
  },
};

export function getWorkoutBlockDisplay(type: string) {
  if (type in WORKOUT_BLOCK_DISPLAY) {
    return WORKOUT_BLOCK_DISPLAY[type as BlockType];
  }

  return WORKOUT_BLOCK_DISPLAY.MAIN_WORKOUT;
}

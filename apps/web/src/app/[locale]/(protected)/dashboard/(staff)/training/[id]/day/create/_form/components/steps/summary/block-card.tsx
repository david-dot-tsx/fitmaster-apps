import React from "react";

import {
  type ExerciseBaseWithId,
  type WorkoutCreateBlockBase,
  type WorkoutBlockTypes,
} from "@repo/validators";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExerciseRow } from "@/app/[locale]/(protected)/dashboard/(staff)/training/[id]/day/create/_form/components/steps/summary/exercise-row";
import { stepConfig } from "@/app/[locale]/(protected)/dashboard/(staff)/training/[id]/day/create/_form/day-create-content";
import { cn } from "@/lib/utils";
import { DAY_CREATOR_STEPS } from "@/app/[locale]/(protected)/dashboard/(staff)/training/[id]/day/create/_form/consts/steps";
import { useT } from "@/lib/i18n/i18n";

interface BlockCardProps {
  block: WorkoutCreateBlockBase;
  blockType: WorkoutBlockTypes;
  exercises?: ExerciseBaseWithId[];
}
export const BlockCard = ({ block, blockType, exercises }: BlockCardProps) => {
  const config = stepConfig[blockType];
  const { t } = useT();

  return (
    <Card
      className={cn("mb-6 border-zinc-800 bg-zinc-950/50", {
        "shadow-amber-400/20": blockType === DAY_CREATOR_STEPS.WARM_UP,
        "shadow-amber-500/20": blockType === DAY_CREATOR_STEPS.MAIN_WORKOUT,
        "shadow-blue-400/20": blockType === DAY_CREATOR_STEPS.COOL_DOWN,
      })}
    >
      <CardHeader className="flex flex-row items-center space-x-4 space-y-0 pb-4">
        <div className="rounded-full border border-zinc-800 bg-zinc-900 p-2">{config.icon}</div>
        <CardTitle className="text-xl font-bold tracking-tight text-zinc-100">
          {t(config.label)}
        </CardTitle>
        <Badge variant="outline" className="ml-auto border-amber-400/20 text-amber-400">
          {t("exercisesCount", { count: block.exercises.length })}
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {block.exercises.map((ex, idx) => (
            <ExerciseRow key={ex.exerciseId + idx} exercise={ex} exercises={exercises} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

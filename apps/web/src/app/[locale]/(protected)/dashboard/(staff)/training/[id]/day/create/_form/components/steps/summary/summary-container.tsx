import React, { useMemo } from "react";
import { entries, groupBy, values } from "remeda";

import {
  Difficulty,
  type ExerciseBaseWithId,
  type Training,
  type TrainingDayCreateInput,
} from "@repo/validators";

import { Separator } from "@/components/ui/separator";
import { SummaryContainerBody } from "@/app/[locale]/(protected)/dashboard/(staff)/training/[id]/day/create/_form/components/steps/summary/summary-container-body";
import { SummaryStats } from "@/app/[locale]/(protected)/dashboard/(staff)/training/[id]/day/create/_form/components/steps/summary/summary-stats";

export interface Stats {
  exercises: {
    total: number;
    warmup: number;
    main: number;
    cool: number;
  };
  withWeight: number;
  dominantPart: string;
  intensity: number;
}

interface SummaryContainerProps {
  trainingDayData: TrainingDayCreateInput;
  training?: Training;
  exercises?: ExerciseBaseWithId[];
}
export const SummaryContainer = ({ trainingDayData, exercises }: SummaryContainerProps) => {
  const stats = useMemo(() => {
    const blocks = trainingDayData?.workoutBlocks;
    if (!blocks) return null;

    const allExercises = values(trainingDayData.workoutBlocks).flatMap((b) => b.exercises);
    const partCounts = groupBy(
      allExercises,
      (e) => exercises?.find((ex) => ex.id === e.exerciseId)?.bodyPart,
    );

    const dominantPart =
      entries(partCounts).reduce(
        (acc, [key, value]) => {
          return value.length > acc.length ? { part: key, length: value.length } : acc;
        },
        { part: "", length: 0 },
      ).part || "-";

    const difficultyWeight = {
      [Difficulty.EASY]: 1,
      [Difficulty.MEDIUM]: 2,
      [Difficulty.HARD]: 3,
    };

    const avgIntensity =
      allExercises.length > 0
        ? Math.round(
            allExercises.reduce(
              (acc, ex) =>
                acc +
                (difficultyWeight[
                  exercises?.find((e) => e.id === ex.exerciseId)?.difficulty || Difficulty.EASY
                ] || 1),
              0,
            ) / allExercises.length,
          )
        : 0;

    return {
      exercises: {
        total: allExercises.length,
        warmup: blocks.WARM_UP.exercises.length,
        main: blocks.MAIN_WORKOUT.exercises.length,
        cool: blocks.COOL_DOWN.exercises.length,
      },
      withWeight: allExercises.filter((e) => e.weight && e.weight > 0).length,
      dominantPart,
      intensity: avgIntensity,
    };
  }, [trainingDayData, exercises]);

  return (
    <div className="relative mx-auto flex size-full max-h-full flex-col">
      <Separator className="mb-8 bg-zinc-800" />
      <SummaryContainerBody trainingDayData={trainingDayData} exercises={exercises} />
      {stats && <SummaryStats stats={stats} />}
    </div>
  );
};

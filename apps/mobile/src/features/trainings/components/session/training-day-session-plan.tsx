import React, { useMemo } from "react";
import { entries, groupBy, map, pipe, find } from "remeda";
import { cn } from "@gluestack-ui/utils/nativewind-utils";

import {
  WorkoutExerciseSessionStatus,
  type TrainingSessionWorkoutWithDetails,
} from "@repo/validators";

import { VStack } from "@/components/ui/vstack";
import { TrainingDaySessionBlock } from "@/features/trainings/components/session/training-day-session-block";
import { BLOCK_ORDER, type BlockType } from "@/features/trainings/constants/workout-block-display";

export { BLOCK_ORDER, type BlockType };

interface TrainingDaySessionPlanProps {
  sessionExercises: TrainingSessionWorkoutWithDetails[];
  className?: string;
}
export const TrainingDaySessionPlan = ({
  sessionExercises,
  className,
}: TrainingDaySessionPlanProps) => {
  const sections = useMemo(
    () =>
      pipe(
        sessionExercises,
        groupBy((s) => s.workoutExercise.workoutBlockType),
        entries(),
        map(([title, data]) => ({ title, data })),
      )
        .filter((section) => section.title in BLOCK_ORDER)
        .map((section) => ({ title: section.title as BlockType, data: section.data }))
        .sort((a, b) => BLOCK_ORDER[a.title] - BLOCK_ORDER[b.title]),
    [sessionExercises],
  );
  const currentExercise = useMemo(
    () =>
      find(
        sessionExercises,
        (e: TrainingSessionWorkoutWithDetails) =>
          e.status === WorkoutExerciseSessionStatus.IN_PROGRESS ||
          e.status === WorkoutExerciseSessionStatus.NOT_STARTED,
      ),
    [sessionExercises],
  );

  return (
    <VStack className={cn("gap-4", className)}>
      {sections.map((section) => (
        <TrainingDaySessionBlock
          key={section.title}
          blockType={section.title}
          exercises={section.data}
          currentExercise={currentExercise}
        />
      ))}
    </VStack>
  );
};

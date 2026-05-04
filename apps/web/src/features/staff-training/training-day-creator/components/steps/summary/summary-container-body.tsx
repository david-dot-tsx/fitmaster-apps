import React from "react";

import { type ExerciseBaseWithId, type WorkoutBlockTypes } from "@repo/validators";

import { BlockCard } from "@/features/staff-training/training-day-creator/components/steps/summary/block-card";
import { type StoredTrainingDayCreateInput } from "@/features/staff-training/training-day-creator/store/day-creator.store";

interface SummaryContainerBodyProps {
  trainingDayCreateInput: StoredTrainingDayCreateInput;
  exercises?: ExerciseBaseWithId[];
}
export const SummaryContainerBody = ({
  trainingDayCreateInput,
  exercises,
}: SummaryContainerBodyProps) => {
  return (
    <div className="grid gap-2">
      {Object.entries(trainingDayCreateInput.workoutBlocks).map(([key, block]) => (
        <BlockCard
          key={key}
          block={block}
          blockType={key as WorkoutBlockTypes}
          exercises={exercises}
        />
      ))}
    </div>
  );
};

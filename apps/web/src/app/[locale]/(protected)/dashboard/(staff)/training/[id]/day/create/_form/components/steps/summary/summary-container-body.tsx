import React from "react";

import { type ExerciseBaseWithId, type WorkoutBlockTypes } from "@repo/validators";

import { BlockCard } from "@/app/[locale]/(protected)/dashboard/(staff)/training/[id]/day/create/_form/components/steps/summary/block-card";
import { type StoredTrainingDayCreateInput } from "@/app/[locale]/(protected)/dashboard/(staff)/training/[id]/day/create/_form/store/day-creator.store";

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

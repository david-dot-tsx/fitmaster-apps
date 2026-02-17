import React from "react";

import {
  type ExerciseBaseWithId,
  type WorkoutBlockTypes,
  type TrainingDayCreateInput,
} from "@repo/validators";

import { BlockCard } from "@/app/[locale]/(protected)/dashboard/(staff)/training/[id]/day/create/_form/components/steps/summary/block-card";

interface SummaryContainerBodyProps {
  trainingDayData: TrainingDayCreateInput;
  exercises?: ExerciseBaseWithId[];
}
export const SummaryContainerBody = ({ trainingDayData, exercises }: SummaryContainerBodyProps) => {
  return (
    <div className="grid gap-2">
      {Object.entries(trainingDayData.workoutBlocks).map(([key, block]) => (
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

import { entries } from "remeda";

import { type TrainingDayCreateInput } from "@repo/validators";

export const createWorkoutBlocks = (input: TrainingDayCreateInput) => {
  const workoutBlocks = entries(input.workoutBlocks).map(([key, value]) => {
    return {
      workoutBlockType: key,
      workoutExercises: {
        create: value.exercises.map((exercise) => {
          return {
            exerciseId: exercise.exerciseId,
            reps: exercise.reps,
            duration: exercise.duration,
            distance: exercise.distance,
            weight: exercise.weight,
          };
        }),
      },
    };
  });

  return workoutBlocks;
};

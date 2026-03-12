import React from "react";
import { View } from "react-native";

import { Text } from "@/components/ui/text";
import { Heading } from "@/components/ui/heading";

import { TrainingExerciseRow } from "./training-exercise-row";

type Exercise = {
  id: string;
  name: string;
  imageUrl: string;
  difficulty: string;
  bodyPart: string;
};

type TrainingExerciseListProps = {
  exercises: Exercise[];
};

export const TrainingExerciseList = ({ exercises }: TrainingExerciseListProps) => {
  if (exercises.length === 0) {
    return <Text className="text-center text-zinc-500">No exercises added yet.</Text>;
  }

  return (
    <View>
      <Heading size="sm" className="mb-3 uppercase tracking-widest text-zinc-400">
        Exercises
      </Heading>
      {exercises.map((exercise) => (
        <TrainingExerciseRow
          key={exercise.id}
          id={exercise.id}
          name={exercise.name}
          imageUrl={exercise.imageUrl}
          difficulty={exercise.difficulty}
          bodyPart={exercise.bodyPart}
        />
      ))}
    </View>
  );
};

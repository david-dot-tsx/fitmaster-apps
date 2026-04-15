import React from "react";

import { useT } from "@/lib/i18n";
import { Text } from "@/components/ui/text";
import { Section } from "@/components/ui/section";

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
  const { t } = useT();

  return (
    <Section title={t("exercises")}>
      {exercises.length > 0 ? (
        exercises.map((exercise) => (
          <TrainingExerciseRow
            key={exercise.id}
            id={exercise.id}
            name={exercise.name}
            imageUrl={exercise.imageUrl}
            difficulty={exercise.difficulty}
            bodyPart={exercise.bodyPart}
          />
        ))
      ) : (
        <Text className="text-center text-zinc-500">{t("noExercisesAddedYet")}</Text>
      )}
    </Section>
  );
};

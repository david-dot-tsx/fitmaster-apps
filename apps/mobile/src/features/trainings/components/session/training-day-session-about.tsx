import React, { useMemo } from "react";
import { View } from "react-native";
import { entries, groupBy } from "remeda";

import {
  Difficulty,
  WorkoutExerciseSessionStatus,
  type TrainingSessionWorkoutWithDetails,
} from "@repo/validators";

import { useT } from "@/lib/i18n";
import { StatPill } from "@/components/ui/stat-pill";
import { TrainingDaySessionStats } from "@/features/trainings/components/session/training-day-session-stats";
import { VStack } from "@/components/ui/vstack";

interface TrainingDaySessionAboutProps {
  sessionExercises: TrainingSessionWorkoutWithDetails[];
}
export const TrainingDaySessionAbout = ({ sessionExercises }: TrainingDaySessionAboutProps) => {
  const { t } = useT();
  const stats = useMemo(() => {
    const total = sessionExercises.length;
    if (total === 0) {
      return {
        total: 0,
        warmup: 0,
        main: 0,
        cool: 0,
        completed: 0,
        withWeight: 0,
        dominantPart: "—",
        intensity: 0,
      };
    }

    const warmup = sessionExercises.filter(
      (s) => s.workoutExercise.workoutBlockType === "WARM_UP",
    ).length;
    const main = sessionExercises.filter(
      (s) => s.workoutExercise.workoutBlockType === "MAIN_WORKOUT",
    ).length;
    const cool = sessionExercises.filter(
      (s) => s.workoutExercise.workoutBlockType === "COOL_DOWN",
    ).length;
    const completed = sessionExercises.filter(
      (s) => s.status === WorkoutExerciseSessionStatus.COMPLETED,
    ).length;
    const withWeight = sessionExercises.filter(
      (s) => s.workoutExercise.weight != null && s.workoutExercise.weight > 0,
    ).length;

    const partCounts = groupBy(sessionExercises, (s) => s.workoutExercise.exercise.bodyPart);
    const dominantPart =
      entries(partCounts).reduce(
        (acc, [key, value]) =>
          value.length > acc.length ? { part: key, length: value.length } : acc,
        { part: "" as string, length: 0 },
      ).part || "—";

    const difficultyWeight: Record<Difficulty, number> = {
      [Difficulty.EASY]: 1,
      [Difficulty.MEDIUM]: 2,
      [Difficulty.HARD]: 3,
    };
    const intensity = Math.round(
      sessionExercises.reduce(
        (acc, s) => acc + difficultyWeight[s.workoutExercise.exercise.difficulty],
        0,
      ) / total,
    );

    return { total, warmup, main, cool, completed, withWeight, dominantPart, intensity };
  }, [sessionExercises]);

  const progressPct = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  return (
    <VStack className="gap-12">
      <View className="flex-row flex-wrap gap-y-3 ">
        <StatPill
          label={t("volume")}
          value={stats.total}
          subLabel={t("exercises")}
          barClass="bg-amber-400"
          barProgress={stats.total > 0 ? 100 : 0}
        />
        <StatPill
          label={t("progress")}
          value={`${stats.completed}/${stats.total}`}
          subLabel={t("done")}
          barClass="bg-emerald-400"
          barProgress={progressPct}
        />
        <StatPill
          label={t("warmup")}
          value={stats.warmup}
          barClass="bg-zinc-400"
          barProgress={stats.total > 0 ? (stats.warmup / stats.total) * 100 : 0}
        />
        <StatPill
          label={t("main")}
          value={stats.main}
          barClass="bg-amber-500"
          barProgress={stats.total > 0 ? (stats.main / stats.total) * 100 : 0}
        />
        <StatPill
          label="Cool down"
          value={stats.cool}
          barClass="bg-blue-400"
          barProgress={stats.total > 0 ? (stats.cool / stats.total) * 100 : 0}
        />
      </View>

      <TrainingDaySessionStats
        dominantPart={stats.dominantPart}
        intensity={stats.intensity}
        withWeight={stats.withWeight}
        total={stats.total}
      />
    </VStack>
  );
};

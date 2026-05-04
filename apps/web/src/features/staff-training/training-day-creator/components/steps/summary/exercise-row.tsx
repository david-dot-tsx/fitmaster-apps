import { type ExerciseBaseWithId, type WorkoutBlockExercise } from "@repo/validators";

import { useT } from "@/lib/i18n/i18n";

export const ExerciseRow = ({
  exercise,
  exercises,
}: {
  exercise: WorkoutBlockExercise;
  exercises?: ExerciseBaseWithId[];
}) => {
  const { t } = useT();

  return (
    <div className="group relative flex items-center justify-between rounded-lg border border-transparent p-3 transition-colors hover:border-zinc-800 hover:bg-zinc-900/50">
      <div className="flex items-center space-x-4">
        <div className="h-10 w-1 rounded-full bg-amber-400" />

        <div>
          <p className="font-orbitron text-sm font-medium uppercase tracking-wide text-zinc-100">
            {exercises?.find((e) => e.id === exercise.exerciseId)?.name}
          </p>{" "}
          <p className="font-mono text-xs uppercase tracking-wider text-zinc-500">
            {exercise.workoutType}
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-6 text-sm">
        {exercise.reps && (
          <div className="text-right">
            <p className="font-mono text-[10px] font-bold uppercase text-zinc-500">{t("reps")}</p>
            <p className="font-mono font-bold text-zinc-200">{exercise.reps}</p>
          </div>
        )}
        {exercise.weight && (
          <div className="border-l border-zinc-800 pl-4 text-right">
            <p className="font-mono text-[10px] font-bold uppercase text-zinc-500">{t("weight")}</p>
            <p className="font-mono font-bold text-amber-400">
              {exercise.weight} {t("units.kg")}
            </p>
          </div>
        )}
        {exercise.distance && (
          <div className="border-l border-zinc-800 pl-4 text-right">
            <p className="font-mono text-[10px] font-bold uppercase text-zinc-500">
              {t("distance")}
            </p>
            <p className="font-mono font-bold text-zinc-200">
              {exercise.distance} {t("units.meters")}
            </p>
          </div>
        )}
        {exercise.duration && (
          <div className="border-l border-zinc-800 pl-4 text-right">
            <p className="font-mono text-[10px] font-bold uppercase text-zinc-500">
              {t("duration")}
            </p>
            <p className="font-mono font-bold text-zinc-200">
              {exercise.duration} {t("units.seconds")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

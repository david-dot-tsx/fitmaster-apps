import { type ExerciseBaseWithId, type WorkoutBlockExercise } from "@repo/validators";

export const ExerciseRow = ({
  exercise,
  exercises,
}: {
  exercise: WorkoutBlockExercise;
  exercises?: ExerciseBaseWithId[];
}) => (
  <div className="group relative flex items-center justify-between rounded-lg border border-transparent p-3 transition-colors hover:border-zinc-800 hover:bg-zinc-900/50">
    <div className="flex items-center space-x-4">
      <div className="h-10 w-1 rounded-full bg-amber-400" />

      <div>
        <p className="text-sm font-medium text-zinc-100">
          {exercises?.find((e) => e.id === exercise.exerciseId)?.name}
        </p>{" "}
        <p className="text-xs uppercase tracking-wider text-zinc-500">{exercise.workoutType}</p>
      </div>
    </div>

    <div className="flex items-center space-x-6 text-sm">
      {exercise.reps && (
        <div className="text-right">
          <p className="text-[10px] uppercase text-zinc-500">Reps</p>
          <p className="font-mono font-bold text-zinc-200">{exercise.reps}</p>
        </div>
      )}
      {exercise.weight && (
        <div className="border-l border-zinc-800 pl-4 text-right">
          <p className="text-[10px] uppercase text-zinc-500">Weight</p>
          <p className="font-mono font-bold text-amber-400">{exercise.weight}kg</p>
        </div>
      )}
      {exercise.distance && (
        <div className="border-l border-zinc-800 pl-4 text-right">
          <p className="text-[10px] uppercase text-zinc-500">Dist</p>
          <p className="font-mono font-bold text-zinc-200">{exercise.distance}m</p>
        </div>
      )}
      {exercise.duration && (
        <div className="border-l border-zinc-800 pl-4 text-right">
          <p className="text-[10px] uppercase text-zinc-500">Duration</p>
          <p className="font-mono font-bold text-zinc-200">{exercise.duration}s</p>
        </div>
      )}
    </div>
  </div>
);

import {
  type WorkoutBlockTypes,
  workoutBlockTypesSchema,
  type TrainingDayDetailed,
} from "@repo/validators";

import { cn } from "@/lib/utils";

export const TrainingDayItem = ({ day, index }: { day: TrainingDayDetailed; index: number }) => {
  return (
    <div className="group relative flex gap-12">
      {/* Timeline Connector */}
      <div className="relative flex flex-col items-center">
        <div className="absolute top-0">
          <div className="flex size-10 items-center justify-center rounded-full border-2 border-zinc-800 bg-zinc-950 font-black text-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.1)]">
            <span>{index + 1}</span>
          </div>
        </div>
        <div className="h-full w-[2px] bg-gradient-to-b from-zinc-800 to-zinc-800/50 group-last:mb-12 group-last:to-transparent" />
      </div>

      {/* Content */}
      <div className="flex-1 pb-12">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 backdrop-blur-sm transition-all hover:border-zinc-700">
          <h3 className="mb-6 flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">
            Day Configuration
            <div className="h-px flex-1 bg-zinc-800/50" />
          </h3>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <BlockSection
              title="Warm Up"
              block={day.workoutBlocks.WARM_UP}
              blockType={workoutBlockTypesSchema.enum.WARM_UP}
            />
            <BlockSection
              title="Main Workout"
              block={day.workoutBlocks.MAIN_WORKOUT}
              blockType={workoutBlockTypesSchema.enum.MAIN_WORKOUT}
              isMain
            />
            <BlockSection
              title="Cool Down"
              block={day.workoutBlocks.COOL_DOWN}
              blockType={workoutBlockTypesSchema.enum.COOL_DOWN}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const BlockSection = ({
  title,
  block,
  blockType,
  isMain,
}: {
  title: string;
  block: TrainingDayDetailed["workoutBlocks"][keyof TrainingDayDetailed["workoutBlocks"]];
  blockType: WorkoutBlockTypes;
  isMain?: boolean;
}) => (
  <div className={cn("space-y-4", { "transition-transform lg:scale-105": isMain })}>
    <div className="flex items-center gap-2">
      <div
        className={cn("size-1.5 rounded-full shadow-[0_0_8px_currentColor]", {
          "bg-zinc-400": blockType === workoutBlockTypesSchema.enum.WARM_UP,
          "bg-amber-400": blockType === workoutBlockTypesSchema.enum.MAIN_WORKOUT,
          "bg-blue-400": blockType === workoutBlockTypesSchema.enum.COOL_DOWN,
        })}
      />
      <span
        className={cn("text-[10px] font-black uppercase tracking-widest", {
          "text-zinc-400": blockType === workoutBlockTypesSchema.enum.WARM_UP,
          "text-amber-400": blockType === workoutBlockTypesSchema.enum.MAIN_WORKOUT,
          "text-blue-400": blockType === workoutBlockTypesSchema.enum.COOL_DOWN,
        })}
      >
        {title}
      </span>
    </div>

    <div className="space-y-2">
      {block.map((workoutExercise) => (
        <div
          key={workoutExercise.id}
          className="flex flex-col rounded-lg border border-zinc-800/50 bg-black/20 p-3 transition-colors hover:bg-black/40"
        >
          <span className="text-xs font-bold uppercase tracking-tight text-zinc-200">
            {workoutExercise.exercise.name}
          </span>

          <div className="mt-2 flex items-center gap-3 text-[10px] font-black uppercase text-zinc-500">
            {workoutExercise.reps && <span>{workoutExercise.reps} Reps</span>}
            {workoutExercise.duration && <span>{workoutExercise.duration} Min</span>}
            {workoutExercise.distance && <span>{workoutExercise.distance} Km</span>}
            {workoutExercise.weight && (
              <span className="text-amber-500">{workoutExercise.weight} Kg</span>
            )}
          </div>
        </div>
      ))}
      {block.length === 0 && <span className="italic text-zinc-600">No exercises planned</span>}
    </div>
  </div>
);

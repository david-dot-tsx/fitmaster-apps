"use client";
import { useFormContext, useWatch } from "react-hook-form";
import { TrashIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import {
  type ExerciseBaseWithId,
  WorkoutType,
  type WorkoutCreateBlockBase,
} from "@repo/validators";

import { Button } from "@/components/ui/button";
import { FormSelect, type SelectOption } from "@/components/form/form-select";
import { useTRPC } from "@/lib/trpc/client";
import { ExercisePreview } from "@/app/[locale]/(protected)/dashboard/(staff)/training/[id]/day/create/_form/components/workout-block/exercise-preview";
import { FormInputNumber } from "@/components/form/form-input-number";
import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { LoadingState } from "@/components/query/loading-state";
import { ErrorState } from "@/components/query/error-state";
import { useT } from "@/lib/i18n/i18n";

const getExerciseSelectOptions = (exercises: ExerciseBaseWithId[]) => {
  return exercises.map((exercise) => ({ children: exercise.name, value: exercise.id })) || [];
};

interface WorkoutBlockRowProps {
  fieldId: string;
  index: number;
  remove: (index: number) => void;
}

//TODO: create translations for db enums
const workoutTypeOptions: SelectOption[] = [
  { children: "Strength", value: WorkoutType.STRENGTH },
  { children: "Hypertrophy", value: WorkoutType.HYPERTROPHY },
  { children: "Endurance", value: WorkoutType.ENDURANCE },
  { children: "Power", value: WorkoutType.POWER },
  { children: "Mobility", value: WorkoutType.MOBILITY },
  { children: "Flexibility", value: WorkoutType.FLEXIBILITY },
  { children: "Balance", value: WorkoutType.BALANCE },
  { children: "Recovery", value: WorkoutType.RECOVERY },
];

export const WorkoutBlockRow = ({ fieldId, index, remove }: WorkoutBlockRowProps) => {
  const { t } = useT();
  const trpc = useTRPC();
  const {
    control,
    formState: { errors },
  } = useFormContext<WorkoutCreateBlockBase>();
  const {
    data: exercises,
    status: exercisesStatus,
    refetch: refetchExercises,
  } = useQuery(trpc.exercise.list.queryOptions());

  const getFieldName = (name: string) => {
    return `exercises.${index}.${name}`;
  };

  const watchedExerciseId = useWatch({
    control,
    name: `exercises.${index}.exerciseId`,
  });

  return (
    <AccordionItem id={`row-${fieldId}`} value={fieldId} className="group mb-4">
      <AccordionTrigger className="flex rounded-xl border border-zinc-800 bg-zinc-900/30 px-6 py-4 transition-all hover:bg-zinc-900/60 hover:no-underline data-[state=open]:rounded-b-none data-[state=open]:border-amber-400/30 data-[state=open]:bg-zinc-900/80">
        <div className={cn("flex items-center gap-4", errors.exercises?.[index] && "text-red-400")}>
          <div className="flex size-8 items-center justify-center rounded-lg bg-zinc-800 text-sm font-black text-zinc-500 group-data-[state=open]:bg-amber-400 group-data-[state=open]:text-black">
            {index + 1}
          </div>
          <span className="text-lg font-semibold tracking-tight">
            {exercises?.find((e) => e.id === watchedExerciseId)?.name ||
              t("web:pages.trainingDayCreator.stepper.selectExercise")}
          </span>
        </div>
      </AccordionTrigger>
      <AccordionContent className="rounded-b-xl border border-t-0 border-zinc-800 bg-zinc-900/20 p-6 group-data-[state=open]:border-amber-400/30">
        {exercisesStatus === "pending" && <LoadingState className="justify-start py-2" />}
        {exercisesStatus === "error" && (
          <ErrorState onTryAgain={refetchExercises} className="mb-6 items-start text-left" />
        )}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Exercise Preview */}
          <div className="lg:col-span-5">
            <ExercisePreview exercise={exercises?.find((e) => e.id === watchedExerciseId)} />
          </div>

          {/* Inputs */}
          <div className="lg:col-span-7">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <FormSelect
                  disabled={exercisesStatus !== "success"}
                  name={getFieldName("exerciseId")}
                  label={t("web:pages.trainingDayCreator.form.exercise.label")}
                  placeholder={t("web:pages.trainingDayCreator.form.exercise.placeholder")}
                  options={exercises ? getExerciseSelectOptions(exercises) : []}
                />
              </div>
              <FormSelect
                name={getFieldName("workoutType")}
                label={t("web:pages.trainingDayCreator.form.workoutType.label")}
                placeholder={t("web:pages.trainingDayCreator.form.workoutType.placeholder")}
                options={workoutTypeOptions}
              />
              <FormInputNumber
                name={getFieldName("reps")}
                placeholder={t("web:pages.trainingDayCreator.form.reps.placeholder")}
                label={t("web:pages.trainingDayCreator.form.reps.label")}
                decimalScale={0}
                allowNegative={false}
              />
              <FormInputNumber
                name={getFieldName("duration")}
                placeholder={t("web:pages.trainingDayCreator.form.duration.placeholder")}
                label={t("web:pages.trainingDayCreator.form.duration.label")}
                decimalScale={0}
                allowNegative={false}
                suffix={t("units.seconds")}
              />
              <FormInputNumber
                name={getFieldName("distance")}
                placeholder={t("web:pages.trainingDayCreator.form.distance.placeholder")}
                label={t("web:pages.trainingDayCreator.form.distance.label")}
                suffix={t("units.meters")}
                decimalScale={0}
                thousandSeparator=" "
                allowNegative={false}
              />
              <FormInputNumber
                name={getFieldName("weight")}
                placeholder={t("web:pages.trainingDayCreator.form.weight.placeholder")}
                label={t("web:pages.trainingDayCreator.form.weight.label")}
                suffix={t("units.kg")}
                decimalScale={2}
                allowNegative={false}
              />
              <div className="col-span-2 flex justify-end pt-4">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-zinc-500 hover:bg-red-950 hover:text-red-400"
                  onClick={() => remove(index)}
                >
                  <TrashIcon className="mr-2 size-4" />
                  {t("web:pages.trainingDayCreator.form.removeExercise.label")}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

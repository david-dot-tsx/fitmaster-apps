"use client";
import { useFieldArray, useFormContext } from "react-hook-form";
import { useEffect, useState } from "react";
import { PlusIcon } from "lucide-react";

import { type WorkoutCreateBlockBase } from "@repo/validators";

import { Accordion } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import { WorkoutBlockRow } from "@/features/staff-training/training-day-creator/components/workout-block/workout-block-row";
import { cn } from "@/lib/utils";
import { useT } from "@/lib/i18n/i18n";

export const WorkoutBlock = () => {
  const { t } = useT();
  const [expandedItem, setExpandedItem] = useState<string | undefined>(undefined);
  const { control } = useFormContext<WorkoutCreateBlockBase>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "exercises",
  });

  const handleAddExercise = () => {
    append({
      exerciseId: "",
      workoutType: null,
      reps: null,
      duration: null,
      distance: null,
      weight: null,
    });
  };

  useEffect(() => {
    if (fields.length > 0) {
      setExpandedItem(fields[fields.length - 1]?.id);
    }
  }, [fields]);

  useEffect(() => {
    if (fields.length > 0) {
      const lastFieldId = fields[fields.length - 1]?.id;
      const element = document.getElementById(`row-${lastFieldId}`);

      if (element) {
        element.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }
  }, [fields, fields.length]);

  return (
    <div className="flex w-full flex-col">
      <FieldGroup className="my-4">
        <Accordion type="single" collapsible value={expandedItem} onValueChange={setExpandedItem}>
          {fields.map((field, index) => (
            <WorkoutBlockRow key={field.id} fieldId={field.id} index={index} remove={remove} />
          ))}
        </Accordion>
      </FieldGroup>
      <Button
        type="button"
        variant="outline"
        onClick={handleAddExercise}
        className={cn(
          "group relative h-auto w-full border-dashed border-zinc-800 bg-zinc-900/20 py-8 transition-all duration-300",
          "hover:border-amber-400/50 hover:bg-amber-400/5 hover:text-amber-400",
        )}
      >
        <div className="flex flex-col items-center gap-2">
          <div className="flex size-10 items-center justify-center rounded-full border border-zinc-800 bg-zinc-900 transition-colors group-hover:border-amber-400/50 group-hover:bg-zinc-800">
            <PlusIcon className="size-5 transition-transform group-hover:rotate-90" />
          </div>
          <span className="text-xs font-bold uppercase tracking-widest">
            {t("web:pages.trainingDayCreator.stepper.addNextExercise")}
          </span>
        </div>
      </Button>
    </div>
  );
};

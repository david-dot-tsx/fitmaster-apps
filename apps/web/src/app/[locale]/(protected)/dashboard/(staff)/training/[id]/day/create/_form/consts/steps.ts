import { workoutBlockTypesSchema } from "@repo/validators";
import { getTKey } from "@repo/i18n/web";

import { type Step } from "@/components/stepper";

export const DAY_CREATOR_STEPS = {
  [workoutBlockTypesSchema.enum.WARM_UP]: workoutBlockTypesSchema.enum.WARM_UP,
  [workoutBlockTypesSchema.enum.MAIN_WORKOUT]: workoutBlockTypesSchema.enum.MAIN_WORKOUT,
  [workoutBlockTypesSchema.enum.COOL_DOWN]: workoutBlockTypesSchema.enum.COOL_DOWN,
  SUMMARY: "SUMMARY",
} as const;
export type DayCreatorStepKey = keyof typeof DAY_CREATOR_STEPS;
export type DayCreatorStep = (typeof DAY_CREATOR_STEPS)[keyof typeof DAY_CREATOR_STEPS];

export const formStepperSteps: Step<DayCreatorStepKey>[] = [
  {
    label: getTKey("web:pages.trainingDayCreator.stepper.warmUp.label"),
    name: DAY_CREATOR_STEPS.WARM_UP,
  },
  {
    label: getTKey("web:pages.trainingDayCreator.stepper.mainWorkout.label"),
    name: DAY_CREATOR_STEPS.MAIN_WORKOUT,
  },
  {
    label: getTKey("web:pages.trainingDayCreator.stepper.coolDown.label"),
    name: DAY_CREATOR_STEPS.COOL_DOWN,
  },
  {
    label: getTKey("web:pages.trainingDayCreator.stepper.summary.label"),
    name: DAY_CREATOR_STEPS.SUMMARY,
  },
];

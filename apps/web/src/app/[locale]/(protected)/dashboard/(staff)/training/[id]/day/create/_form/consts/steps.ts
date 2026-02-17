import { workoutBlockTypesSchema } from "@repo/validators";

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
  { label: "Warm up", name: DAY_CREATOR_STEPS.WARM_UP },
  { label: "Main workout", name: DAY_CREATOR_STEPS.MAIN_WORKOUT },
  { label: "Cool down", name: DAY_CREATOR_STEPS.COOL_DOWN },
  { label: "Summary", name: DAY_CREATOR_STEPS.SUMMARY },
];

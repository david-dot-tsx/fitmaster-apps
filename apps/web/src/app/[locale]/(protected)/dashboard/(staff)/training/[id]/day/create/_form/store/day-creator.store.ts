import { immer } from "zustand/middleware/immer";
import { create } from "zustand";
import type z from "zod";

import {
  trainingDayCreateInputSchema,
  type WorkoutCreateBlockBase,
  type WorkoutBlockCoolDown,
  type WorkoutBlockMainWorkout,
  type WorkoutBlockWarmUp,
} from "@repo/validators";

import {
  DAY_CREATOR_STEPS,
  type DayCreatorStep,
} from "@/app/[locale]/(protected)/dashboard/(staff)/training/[id]/day/create/_form/consts/steps";

export const storedTrainingDayCreateInputSchema = trainingDayCreateInputSchema.omit({
  trainingId: true,
});
export type StoredTrainingDayCreateInput = z.infer<typeof storedTrainingDayCreateInputSchema>;

const stepOrder: DayCreatorStep[] = [
  DAY_CREATOR_STEPS.WARM_UP,
  DAY_CREATOR_STEPS.MAIN_WORKOUT,
  DAY_CREATOR_STEPS.COOL_DOWN,
  DAY_CREATOR_STEPS.SUMMARY,
] as const;

interface StepIterator {
  next: (() => void) | undefined;
  previous: (() => void) | undefined;
}

const getInitialStep = (order: DayCreatorStep[]) => {
  const step = order[0];
  if (!step) {
    throw new Error("step order is not defined");
  }

  return step;
};

const createStepIterator = (
  currentStep: DayCreatorStep,
  setStep: (step: DayCreatorStep) => void,
): StepIterator => {
  const currentStepIndex = stepOrder.indexOf(currentStep);
  const nextStep = stepOrder[currentStepIndex + 1];
  const previousStep = stepOrder[currentStepIndex - 1];

  const iterator = {
    next: nextStep ? () => setStep(nextStep) : undefined,
    previous: previousStep ? () => setStep(previousStep) : undefined,
  };

  return iterator;
};

interface DayCreatorState {
  currentStep: DayCreatorStep;
  workoutData: {
    [DAY_CREATOR_STEPS.WARM_UP]: WorkoutBlockWarmUp;
    [DAY_CREATOR_STEPS.MAIN_WORKOUT]: WorkoutBlockMainWorkout;
    [DAY_CREATOR_STEPS.COOL_DOWN]: WorkoutBlockCoolDown;
  };
}

interface DayCreatorActions {
  setCurrentStep: (step: DayCreatorStep) => void;
  getStepIterator: () => StepIterator;
  isLastStep: () => boolean;
  saveCurrentStepData: (formData: WorkoutCreateBlockBase) => void;
  getCurrentStepData: () => WorkoutCreateBlockBase | undefined;
  getTrainingDayCreateInput: () => StoredTrainingDayCreateInput;
  resetStore: () => void;
}

const initStoreState = {
  currentStep: getInitialStep(stepOrder),
  workoutData: {
    [DAY_CREATOR_STEPS.WARM_UP]: { exercises: [] },
    [DAY_CREATOR_STEPS.MAIN_WORKOUT]: { exercises: [] },
    [DAY_CREATOR_STEPS.COOL_DOWN]: { exercises: [] },
  },
};
export const useDayCreatorStore = create<DayCreatorState & DayCreatorActions>()(
  immer((set, get) => ({
    ...initStoreState,
    setCurrentStep: (step) => set({ currentStep: step }),
    getStepIterator: () =>
      createStepIterator(get().currentStep, (step: DayCreatorStep) => set({ currentStep: step })),
    isLastStep: () => get().currentStep === stepOrder[stepOrder.length - 1],
    saveCurrentStepData: (formData) =>
      set({ workoutData: { ...get().workoutData, [get().currentStep]: formData } }),
    getCurrentStepData: () => {
      const { currentStep, workoutData } = get();
      if (currentStep === DAY_CREATOR_STEPS.SUMMARY) {
        return undefined;
      }

      return workoutData[currentStep];
    },
    getTrainingDayCreateInput: () => {
      return storedTrainingDayCreateInputSchema.parse({
        workoutBlocks: get().workoutData,
      });
    },
    resetStore: () => set(initStoreState),
  })),
);

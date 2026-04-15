import { findIndex } from "remeda";
import { type ResourceKey } from "i18next";

import { useT } from "@/lib/i18n/i18n";
import { cn } from "@/lib/utils";

export interface Step<T> {
  label: ResourceKey;
  name: T;
}

export type StepStatus = "PREVIOUS" | "CURRENT" | "FOLLOWING";

interface SingleStepComponent<T> {
  status: StepStatus;
  step: Step<T>;
  isLastStep: boolean;
  index: number;
}

const SingleStepComponent = <T,>({ status, step, isLastStep, index }: SingleStepComponent<T>) => {
  const { t } = useT();

  return (
    <li className={cn("flex flex-1 flex-col gap-2", { "pr-4": !isLastStep })}>
      <div className="flex items-center gap-2">
        <div
          className={cn(
            "flex size-8 items-center justify-center rounded-full border-2 text-xs font-bold transition-all",
            {
              "border-amber-400 bg-amber-400 text-black shadow-[0_0_15px_rgba(251,191,36,0.4)]":
                status === "CURRENT",
              "border-amber-400/50 bg-transparent text-amber-400": status === "PREVIOUS",
              "border-zinc-800 bg-zinc-900 text-zinc-500": status === "FOLLOWING",
            },
          )}
        >
          {status === "PREVIOUS" ? "✓" : index + 1}
        </div>
        <span
          className={cn("text-[10px] font-bold uppercase tracking-tighter", {
            "text-amber-400": status === "CURRENT",
            "text-zinc-500": status !== "CURRENT",
          })}
        >
          {t(step.label)}
        </span>
      </div>
      <div className="relative h-1 w-full overflow-hidden rounded-full bg-zinc-800">
        <div
          className={cn("absolute inset-y-0 left-0 transition-all duration-500", {
            "w-full bg-amber-400": status === "PREVIOUS",
            "w-1/2 bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.5)]": status === "CURRENT",
            "w-0": status === "FOLLOWING",
          })}
        />
      </div>
    </li>
  );
};

const stepStatus = (index: number, currentStep: number): StepStatus => {
  if (index < currentStep) return "PREVIOUS";
  if (index > currentStep) return "FOLLOWING";

  return "CURRENT";
};

interface Stepper<T> {
  currentStep: T;
  steps: Step<T>[];
  className?: string;
}

export const Stepper = <T extends string | number>({
  currentStep,
  steps,
  className,
}: Stepper<T>) => {
  const currentStepIndex = findIndex(steps, (step) => step.name === currentStep);

  return (
    <ul className={cn("flex flex-row justify-between", className)}>
      {steps.map((step, index) => {
        return (
          <SingleStepComponent
            key={step.name}
            status={stepStatus(index, currentStepIndex)}
            step={step}
            index={index}
            isLastStep={index === steps.length - 1}
          />
        );
      })}
    </ul>
  );
};

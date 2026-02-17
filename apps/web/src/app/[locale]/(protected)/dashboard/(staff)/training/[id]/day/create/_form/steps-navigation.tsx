import React from "react";
import { ArrowLeftIcon, ArrowRightIcon, CheckIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface StepsNavigationProps {
  className?: string;
  handlePrevious: (() => void) | undefined;
  isLastStep: boolean;
}

export const StepsNavigation = ({
  className,
  handlePrevious,
  isLastStep,
}: StepsNavigationProps) => {
  return (
    <div
      className={cn(
        "mt-12 flex w-full items-center justify-between gap-4 border-t border-zinc-800 pt-8",
        className,
      )}
    >
      <Button
        type="button"
        variant="ghost"
        onClick={handlePrevious}
        disabled={!handlePrevious}
        className="h-12 px-6 text-zinc-500 hover:bg-zinc-900 hover:text-white"
      >
        <ArrowLeftIcon className="mr-2 size-4" />
        Back
      </Button>

      <Button
        type="submit"
        className={cn(
          "h-12 px-8 font-black uppercase tracking-tight transition-all duration-300",
          isLastStep
            ? "bg-green-500 text-black shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:bg-green-400"
            : "bg-amber-400 text-black shadow-[0_0_20px_rgba(251,191,36,0.3)] hover:bg-amber-500",
        )}
      >
        <span>{isLastStep ? "Finalize Training" : "Continue"}</span>
        {isLastStep ? (
          <CheckIcon className="ml-2 size-5" />
        ) : (
          <ArrowRightIcon className="ml-2 size-5" />
        )}
      </Button>
    </div>
  );
};

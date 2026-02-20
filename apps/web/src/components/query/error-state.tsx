"use client";

import React from "react";
import { AlertTriangle, RotateCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ErrorState({
  title = "Error",
  onTryAgain,
  tryAgainLabel = "Try again",
  className,
}: {
  title?: string;
  onTryAgain: () => void;
  tryAgainLabel?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex w-full flex-col items-center justify-center gap-3 rounded-xl border border-red-500/20 bg-zinc-950/50 p-6 text-center backdrop-blur",
        className,
      )}
      role="alert"
    >
      <div className="flex items-center gap-2 text-red-400">
        <AlertTriangle className="size-5" />
        <div className="text-sm font-black uppercase tracking-widest">{title}</div>
      </div>

      <div className="max-w-prose text-xs font-bold uppercase leading-relaxed tracking-widest text-zinc-500">
        Something went wrong. Please try again.
      </div>

      <Button type="button" variant="outline" onClick={onTryAgain} className="mt-2">
        <RotateCw />
        {tryAgainLabel}
      </Button>
    </div>
  );
}

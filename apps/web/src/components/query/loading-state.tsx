"use client";

import React from "react";

import { cn } from "@/lib/utils";
import { Spinner } from "@/components/ui/spinner";

export function LoadingState({
  message = "Loading…",
  className,
}: {
  message?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex animate-pulse items-center justify-center gap-3 py-8 text-zinc-400",
        className,
      )}
    >
      <Spinner className="size-8" />
      <span className="text-sm font-bold uppercase tracking-widest">{message}</span>
    </div>
  );
}

"use client";

import React from "react";
import { type ResourceKey } from "i18next";

import { getTKey } from "@repo/i18n/web";

import { cn } from "@/lib/utils";
import { Spinner } from "@/components/ui/spinner";
import { useTranslation } from "@/lib/i18n/i18n";

export function LoadingState({
  message = getTKey("common:loading"),
  className,
}: {
  message?: ResourceKey;
  className?: string;
}) {
  const { t } = useTranslation();

  return (
    <div
      className={cn(
        "flex animate-pulse items-center justify-center gap-3 py-8 text-zinc-400",
        className,
      )}
    >
      <Spinner className="size-8" />
      <span className="text-sm font-bold uppercase tracking-widest">{t(message)}...</span>
    </div>
  );
}

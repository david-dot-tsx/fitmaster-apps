"use client";

import React from "react";
import { AlertTriangle, RotateCw } from "lucide-react";
import { useTranslation } from "react-i18next";
import { type ResourceKey } from "i18next";

import { getTKey } from "@repo/i18n/web";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ErrorState({
  title = getTKey("common:error"),
  onTryAgain,
  tryAgainLabel = getTKey("common:tryAgain"),
  className,
}: {
  title?: ResourceKey;
  onTryAgain: () => void;
  tryAgainLabel?: ResourceKey;
  className?: string;
}) {
  const { t } = useTranslation();

  return (
    <div
      className={cn(
        "flex w-full flex-col items-center justify-center gap-3 rounded-xl border border-red-500/20 bg-zinc-950/50 px-6 py-12 text-center backdrop-blur",
        className,
      )}
      role="alert"
    >
      <div className="flex items-center gap-2 text-red-400">
        <AlertTriangle className="size-5" />
        <div className="text-sm font-black uppercase tracking-widest">{t(title)}</div>
      </div>

      <div className="max-w-prose text-xs font-bold uppercase leading-relaxed tracking-widest text-zinc-500">
        {t("errors.generic.description")}
      </div>

      <Button type="button" variant="outline" onClick={onTryAgain} className="mt-2">
        <RotateCw />
        {t(tryAgainLabel)}
      </Button>
    </div>
  );
}

import Link from "next/link";
import React from "react";
import {
  Dumbbell,
  LayoutGrid,
  BarChart3,
  Users2,
  Settings2,
  Wrench,
  ChevronRight,
} from "lucide-react";

import { PageWrapper } from "@/components/layout/page-wrapper";
import { getQueryClient, trpcServerOptionsProxy } from "@/lib/trpc/client-server";
import { cn } from "@/lib/utils";
import { getServerTranslations } from "@/lib/i18n/server";

export const StaffDashboard = async () => {
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(trpcServerOptionsProxy.user.me.queryOptions());
  const { t } = await getServerTranslations();

  return (
    <PageWrapper
      title={t("web:pages.dashboard.staff.title")}
      subtitle={t("web:pages.dashboard.staff.subtitle")}
      eyebrow={t("web:pages.dashboard.staff.eyebrow")}
    >
      <div className="flex flex-col gap-10">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <ModuleCard
            title={t("web:pages.dashboard.staff.cards.programs.title")}
            label={t("web:pages.dashboard.staff.cards.programs.label")}
            href="/dashboard/training"
            icon={LayoutGrid}
          />
          <ModuleCard
            title={t("web:pages.dashboard.staff.cards.exercises.title")}
            label={t("web:pages.dashboard.staff.cards.exercises.label")}
            href="/dashboard/exercise"
            icon={Dumbbell}
          />
          <ModuleCard
            title={t("web:pages.dashboard.staff.cards.analytics.title")}
            label={t("web:pages.dashboard.staff.cards.analytics.label")}
            href="/dashboard/analytics"
            icon={BarChart3}
            disabled={true}
          />
          <ModuleCard
            title={t("web:pages.dashboard.staff.cards.chat.title")}
            label={t("web:pages.dashboard.staff.cards.chat.label")}
            href="#"
            icon={Wrench}
            disabled={true}
          />
          <ModuleCard
            title={t("web:pages.dashboard.staff.cards.users.title")}
            label={t("web:pages.dashboard.staff.cards.users.label")}
            href="/dashboard/users"
            icon={Users2}
            disabled
          />
          <ModuleCard
            title={t("web:pages.dashboard.staff.cards.settings.title")}
            label={t("web:pages.dashboard.staff.cards.settings.label")}
            href="#"
            icon={Settings2}
            disabled={true}
          />
        </div>
        <div className="space-y-4">
          <h2 className="text-lg font-black uppercase italic tracking-tighter text-zinc-100">
            {t("web:pages.dashboard.staff.sections.newestTrainings.title.newest")}{" "}
            <span className="text-amber-400">
              {t("web:pages.dashboard.staff.sections.newestTrainings.title.trainings")}
            </span>
          </h2>
          <div className="w-full overflow-hidden rounded-xl border border-zinc-800/70 bg-zinc-950/50 shadow-2xl backdrop-blur-md">
            <div className="p-8">{t("thisFeatureIsTemporarilyUnavailable")}</div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

const ModuleCard = async ({
  title,
  label,
  href,
  icon: Icon,
  disabled = false,
}: {
  title: string;
  label: string;
  href: string;
  icon: React.ElementType;
  disabled?: boolean;
}) => {
  const Container = disabled ? "div" : Link;
  const { t } = await getServerTranslations();

  return (
    <Container
      href={href}
      className={cn(
        "group flex flex-col rounded-xl border p-5 transition-all duration-300",
        "relative overflow-hidden",
        {
          "cursor-not-allowed border-zinc-800 bg-zinc-950 opacity-80 grayscale": disabled,
          "border-zinc-800 bg-zinc-950/50 hover:border-zinc-700": !disabled,
        },
      )}
    >
      {!disabled && (
        <div className="absolute -left-full -top-full size-[300%] rotate-[35deg] bg-gradient-to-r from-amber-400/20 via-transparent to-transparent transition-all duration-500 ease-in-out group-hover:-left-1/2 group-hover:-top-1/2" />
      )}
      <div className="relative z-10 flex flex-col">
        <div className="mb-4 flex items-center justify-between">
          <h3
            className={cn("text-xs font-black uppercase tracking-[0.2em] transition-colors", {
              "text-zinc-500": disabled,
              "text-zinc-500 group-hover:text-amber-400": !disabled,
            })}
          >
            {title}
          </h3>

          <div
            className={cn("rounded-lg border p-2 transition-colors", {
              "border-zinc-800 bg-zinc-900 text-zinc-400 group-hover:border-amber-400/20 group-hover:text-amber-400":
                !disabled,
            })}
          >
            <Icon size={16} strokeWidth={disabled ? 1 : 2.5} />
          </div>
        </div>

        <div className="flex flex-col">
          <span
            className={cn(
              "ml-2.5 flex flex-row items-center text-xl font-black uppercase italic tracking-tight",
              {
                "text-zinc-600": disabled,
                "text-zinc-100": !disabled,
              },
            )}
          >
            {label}{" "}
            <ChevronRight className="ml-1 size-6 transition-colors duration-300 group-hover:text-amber-400" />
          </span>
          {disabled && (
            <span className="mt-6 text-[10px] font-medium uppercase tracking-widest text-zinc-500">
              {t("thisFeatureIsTemporarilyUnavailable")}
            </span>
          )}
        </div>
      </div>
    </Container>
  );
};

import Link from "next/link";
import React from "react";
import { Dumbbell, LayoutGrid, BarChart3, Users2, Settings2, Wrench } from "lucide-react";

import { PageWrapper } from "@/components/layout/page-wrapper";
import { getQueryClient, trpcServerOptionsProxy } from "@/lib/trpc/client-server";
import { cn } from "@/lib/utils";

export const StaffDashboard = async () => {
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(trpcServerOptionsProxy.user.me.queryOptions());

  return (
    <PageWrapper title="Dashboard" subtitle="Dashboard panel">
      <div className="flex flex-col gap-10">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <ModuleCard
            title="Programs"
            label="View Trainings"
            href="/dashboard/training"
            icon={LayoutGrid}
          />
          <ModuleCard
            title="Exercises"
            label="Library"
            href="/dashboard/exercise"
            icon={Dumbbell}
          />
          <ModuleCard
            title="Analytics"
            label="Reports"
            href="/dashboard/analytics"
            icon={BarChart3}
            disabled={true}
          />
          <ModuleCard title="Chat" label="Chat with users" href="#" icon={Wrench} disabled={true} />
          <ModuleCard
            title="Users"
            label="Manage Users"
            href="/dashboard/users"
            icon={Users2}
            disabled
          />
          <ModuleCard
            title="Settings"
            label="App Settings"
            href="#"
            icon={Settings2}
            disabled={true}
          />
        </div>
        <div className="space-y-4">
          <h2 className="text-lg font-black uppercase italic tracking-tighter text-zinc-100">
            Newest <span className="text-amber-400">Trainings</span>
          </h2>
          <div className="w-full overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950/50 shadow-2xl backdrop-blur-md">
            Tutaj Twoja komponent TrainingTable lub uproszczona wersja
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

const ModuleCard = ({
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
            className={cn("text-xl font-black uppercase italic tracking-tight", {
              "text-zinc-600": disabled,
              "text-zinc-100": !disabled,
            })}
          >
            {label}
          </span>
          {disabled && (
            <span className="mt-1 text-[8px] font-bold uppercase tracking-widest text-amber-500/50">
              Unavailable
            </span>
          )}
        </div>
      </div>
    </Container>
  );
};

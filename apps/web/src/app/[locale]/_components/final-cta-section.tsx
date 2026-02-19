import React from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const FinalCTASection = () => {
  return (
    <section
      className={cn(
        "relative mt-32 overflow-hidden rounded-[2rem] border border-amber-400/30 bg-[radial-gradient(circle_at_50%_0%,rgba(251,191,36,0.08),transparent_70%)] p-12 text-center",
        "transition-all duration-300 has-[a:hover]:shadow-2xl has-[a:hover]:shadow-amber-400/10 md:p-24",
      )}
    >
      <div className="absolute left-6 top-6 size-4 border-l-2 border-t-2 border-amber-400/30" />
      <div className="absolute right-6 top-6 size-4 border-r-2 border-t-2 border-amber-400/30" />

      <div className="absolute bottom-6 left-6 size-4 border-b-2 border-l-2 border-amber-400/30" />
      <div className="absolute bottom-6 right-6 size-4 border-b-2 border-r-2 border-amber-400/30" />

      <div className="relative z-10 mx-auto max-w-2xl">
        <span className="text-[10px] font-black uppercase tracking-[0.5em] text-amber-400/80">
          Final Phase
        </span>

        <h2 className="mt-4 text-4xl font-black uppercase italic tracking-tighter text-zinc-100 md:text-6xl">
          Commit to the <br />
          <span className="text-glow text-amber-400">
            Protocol<span className="text-zinc-500">.</span>
          </span>
        </h2>

        <p className="mx-auto mt-6 max-w-md text-sm leading-relaxed text-zinc-300 md:text-base">
          Your transformation is no longer a matter of chance. Secure your access to the system and
          deploy your training via our mobile interface.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4">
          <Button
            asChild
            className="h-16 w-full bg-amber-400 px-12 font-black uppercase tracking-[0.2em] text-black shadow-[0_0_30px_rgba(251,191,36,0.3)] transition-all hover:scale-105 hover:bg-amber-500 md:w-auto"
          >
            <Link href="/auth/register">Initialize Transformation</Link>
          </Button>

          <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-500">
            Compatible with iOS & Android
          </span>
        </div>
      </div>

      <div className="absolute -bottom-24 left-1/2 h-48 w-96 -translate-x-1/2 bg-amber-400/10 blur-[100px]" />
    </section>
  );
};

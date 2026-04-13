"use client";

import { Button } from "@/components/ui/button";

export default function RootError({
  reset,
  error,
}: {
  reset: () => void;
  error: Error & { digest?: string };
}) {
  return (
    <div className="flex w-full flex-1 items-center justify-center bg-zinc-950 p-6">
      <div className="w-full max-w-[525px] rounded-xl border border-zinc-800 bg-zinc-950/90 p-8 shadow-2xl backdrop-blur-2xl">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="size-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
            <h2 className="text-2xl font-black uppercase italic tracking-tighter text-zinc-100">
              System <span className="text-red-500">Error</span>
            </h2>
          </div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">
            Something went wrong.
          </p>

          <div className="my-8 rounded border border-zinc-800 bg-black/50 p-4 font-mono text-[11px] text-zinc-400">
            Error code<span className="text-red-400">:</span> {error.digest}
          </div>

          <div className="flex justify-end gap-3">
            <Button onClick={() => (window.location.href = "/")} className="font-medium">
              Go to main page
            </Button>
            <Button onClick={reset} className="font-medium">
              Try again
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

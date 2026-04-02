import { cn } from "@/lib/utils";

export const PageWrapper = ({
  children,
  title,
  subtitle,
  eyebrow,
  className,
  divider = false,
  size = "full",
}: {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  eyebrow?: string;
  className?: string;
  divider?: boolean;
  size?: "full" | "medium";
}) => {
  return (
    <div
      className={cn(
        "relative flex w-full flex-1 flex-col p-8 md:px-16",
        {
          "max-w-full": size === "full",
          "mx-auto max-w-6xl": size === "medium",
        },
        className,
      )}
    >
      <div className="absolute left-0 top-0 -z-10 h-64 w-full bg-gradient-to-b from-amber-400/5 to-transparent opacity-50" />

      {title && (
        <header className="mb-10 flex flex-col gap-1">
          <div className="mb-2 flex items-center gap-2">
            <div className="h-[2px] w-8 bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.5)]" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">
              {eyebrow}
            </span>
          </div>

          <h1 className="text-5xl font-black uppercase italic tracking-tighter text-zinc-100 md:text-6xl">
            {title}
            <span className="text-amber-400">.</span>
          </h1>

          {subtitle && (
            <p className="font-orbitron max-w-2xl text-sm leading-relaxed text-zinc-500">
              {subtitle}
            </p>
          )}
        </header>
      )}

      {divider && (
        <div className="relative mb-10 h-px w-full overflow-hidden bg-zinc-800">
          <div className="absolute left-0 top-0 h-full w-1/3 bg-gradient-to-r from-transparent via-amber-400/40 to-transparent" />
        </div>
      )}

      <main className="w-full flex-1">{children}</main>
    </div>
  );
};

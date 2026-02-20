"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { getUnlocalizedPath } from "@/helpers/unlocalized-path";

export const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => {
  const pathname = usePathname();
  const unlocalizedPathName = getUnlocalizedPath(pathname);
  const isActive = unlocalizedPathName === href;

  return (
    <Link
      href={href}
      className={cn(
        "group relative text-xs font-black uppercase tracking-[0.2em] text-zinc-400 transition-colors hover:text-amber-400",
        { "text-zinc-300": isActive },
      )}
    >
      {children}
      <span
        className={cn(
          "absolute -bottom-6 left-0 z-10 h-[2px] w-0 bg-gradient-to-r from-amber-400 to-transparent shadow-[0_0_8px_rgba(251,191,36,0.8)] transition-all group-hover:w-full",
          { "w-full": isActive, "w-0": !isActive },
        )}
      />
    </Link>
  );
};

import React from "react";

import { NavbarAuth } from "@/components/layout/navbar/navbar-auth";
import { LocaleSwitch } from "@/components/locale-switch";
import { NavLink } from "@/components/layout/navbar/nav-link";
import { cn } from "@/lib/utils";

interface NavbarDesktopProps {
  navLinks: { href: string; label: string }[];
  className?: string;
}

export const NavbarDesktop = ({ navLinks, className }: NavbarDesktopProps) => {
  return (
    <div className={cn("flex flex-1 flex-row items-center justify-between", className)}>
      <div className="flex flex-row gap-8">
        {navLinks.map((link) => (
          <NavLink key={link.href} href={link.href}>
            {link.label}
          </NavLink>
        ))}
      </div>

      <div className="flex flex-row items-center sm:gap-2">
        <LocaleSwitch />
        <div className="h-4 w-px bg-zinc-800" />
        <NavbarAuth />
      </div>
    </div>
  );
};

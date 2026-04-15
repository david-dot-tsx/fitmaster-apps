import React from "react";
import Image from "next/image";
import Link from "next/link";

import { NavbarAuth } from "@/components/layout/navbar/navbar-auth";
import { LocaleSwitch } from "@/components/locale-switch";
import { NavLink } from "@/components/layout/navbar/nav-link";
import { getSessionUser } from "@/lib/session-user";
import { getServerTranslations } from "@/lib/i18n/server";

export const Navbar = async () => {
  const sessionUser = await getSessionUser();
  const { t } = await getServerTranslations();

  const navLinks = [
    ...(sessionUser.isStaff
      ? [
          { href: "/dashboard", label: t("web:layout.navbar.links.dashboard") },
          { href: "/dashboard/training", label: t("web:layout.navbar.links.trainings") },
          { href: "/dashboard/exercise", label: t("web:layout.navbar.links.exercises") },
        ]
      : []),
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-black/60 px-8 backdrop-blur-xl md:px-16">
      <nav className="flex h-16 flex-row items-center justify-between">
        <div className="flex flex-row items-center gap-12">
          <Link
            href={sessionUser.isAuthenticated ? "/dashboard" : "/"}
            className="flex flex-row items-center gap-4 transition-opacity hover:opacity-80"
          >
            <Image
              src="/assets/app-logo.png"
              alt="Logo"
              width={100}
              height={32}
              className="object-contain brightness-110"
            />
            {/* //TODO: move app name to shared package */}
            <span className="text-glow text-2xl font-medium uppercase tracking-[0.2em] text-amber-400">
              FitMaster
            </span>
          </Link>

          <div className="hidden flex-row gap-8 md:flex">
            {navLinks.map((link) => (
              <NavLink key={link.href} href={link.href}>
                {link.label}
              </NavLink>
            ))}
          </div>
        </div>

        <div className="flex flex-row items-center gap-6">
          <LocaleSwitch />
          <div className="h-4 w-px bg-zinc-800" />
          <NavbarAuth />
        </div>
      </nav>

      <div className="absolute bottom-0 left-0 h-0.5 w-full bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />
    </header>
  );
};

import React from "react";
import Image from "next/image";
import Link from "next/link";

import { NavbarAuth } from "@/components/layout/navbar/navbar-auth";
import { LocaleSwitch } from "@/components/locale-switch";
import { hasSessionTokensAction } from "@/actions/session.actions";
import { NavLink } from "@/components/layout/navbar/nav-link";

export const Navbar = async () => {
  const { hasToken, hasRefreshToken } = await hasSessionTokensAction();

  const navLinks = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/dashboard/training", label: "Trainings" },
    { href: "/dashboard/exercise", label: "Exercises" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-black/60 px-8 backdrop-blur-xl md:px-16">
      <nav className="flex h-16 flex-row items-center justify-between">
        <div className="flex flex-row items-center gap-12">
          <Link
            href={hasToken && hasRefreshToken ? "/dashboard" : "/"}
            className="transition-opacity hover:opacity-80"
          >
            <Image
              src="/assets/app-logo.png"
              alt="Logo"
              width={100}
              height={32}
              className="object-contain brightness-110"
            />
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

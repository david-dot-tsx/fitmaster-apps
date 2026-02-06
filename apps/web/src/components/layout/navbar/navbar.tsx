import React from "react";
import Image from "next/image";
import Link from "next/link";

import { NavigationMenuDemo } from "@/components/layout/navbar/navbar-menu";
import { NavbarAuth } from "@/components/layout/navbar/navbar-auth";

export const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 border-b border-b-amber-400 bg-background/80 px-16 backdrop-blur-md">
      <nav className="flex h-16 flex-row items-center justify-between">
        <div className="flex flex-row gap-4">
          <Link href="/">
            <Image
              src="/app-logo.png"
              alt="Logo"
              width={120}
              height={40}
              className="object-contain"
            />
          </Link>
          <NavigationMenuDemo />
        </div>
        <NavbarAuth />
      </nav>
    </header>
  );
};

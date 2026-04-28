"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import { NavLink } from "@/components/layout/navbar/nav-link";
import { Button } from "@/components/ui/button";
import { LocaleSwitch } from "@/components/locale-switch";
import { cn } from "@/lib/utils";
import { NavbarAuth } from "@/components/layout/navbar/navbar-auth";

interface NavbarMobileProps {
  navLinks: { href: string; label: string }[];
  className?: string;
}
export const NavbarMobile = ({ navLinks, className }: NavbarMobileProps) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const menuId = useId();
  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      if (open && ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    },
    [open],
  );

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [handleClickOutside]);

  return (
    <>
      <div className={cn("flex items-center gap-2", className)}>
        <LocaleSwitch />
        <Button
          type="button"
          variant="ghost"
          className="text-zinc-300 hover:text-amber-400"
          aria-expanded={open}
          aria-controls={menuId}
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          <motion.span
            animate={{ rotate: open ? 180 : 0, scale: open ? 0.9 : 1 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="inline-flex"
          >
            <AnimatePresence mode="wait" initial={false}>
              {open ? (
                <motion.span
                  key="close"
                  initial={{ opacity: 0, scale: 0.7, rotate: -90 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, scale: 0.7, rotate: 90 }}
                  transition={{ duration: 0.16 }}
                >
                  <X className="size-10" />
                </motion.span>
              ) : (
                <motion.span
                  key="open"
                  initial={{ opacity: 0, scale: 0.7, rotate: 90 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, scale: 0.7, rotate: -90 }}
                  transition={{ duration: 0.16 }}
                >
                  <Menu className="size-10" />
                </motion.span>
              )}
            </AnimatePresence>
          </motion.span>
        </Button>
      </div>
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              ref={ref}
              className="absolute inset-y-0 left-0 -z-10 w-full bg-background/85"
              initial={{ opacity: 0 }}
              animate={{
                opacity: 1,
                transition: {
                  duration: 0.12,
                  ease: "easeInOut",
                  delay: 0,
                },
              }}
              exit={{
                opacity: 0,
                transition: {
                  duration: 0.18,
                  ease: "easeInOut",
                  delay: 0.12,
                },
              }}
            />
            <motion.div
              key="mobile-menu"
              initial={{ opacity: 0, y: -20 }}
              animate={{
                opacity: 1,
                y: 0,
                transition: {
                  duration: 0.2,
                  ease: "easeOut",
                  delay: 0.12,
                },
              }}
              exit={{
                opacity: 0,
                y: -20,
                transition: {
                  duration: 0.2,
                  ease: "easeOut",
                  delay: 0,
                },
              }}
              className="absolute right-0 top-full -z-10 w-full rounded-b-md border border-border/60 bg-background/95 p-2 shadow-lg backdrop-blur-md md:hidden"
            >
              <nav id={menuId} className="my-2 flex flex-col gap-1 px-4" aria-label="Mobile main">
                <div className="mb-4 flex justify-end">
                  <NavbarAuth />
                </div>
                {navLinks.map(({ href, label }) => (
                  <NavLink
                    key={href}
                    href={href}
                    classNames={{
                      link: "text-base font-normal hover:bg-amber-400/20 p-2 rounded-sm border border-zinc-800/30 hover:border-amber-400/20",
                      linkActive: "bg-amber-400/10",
                      decoration: "hidden",
                    }}
                  >
                    {label}
                  </NavLink>
                ))}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

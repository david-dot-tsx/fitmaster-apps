import Link from "next/link";
import Image from "next/image";
import { Github, Globe, ShieldCheck } from "lucide-react";

import { cn } from "@/lib/utils";

export const Footer = ({ className }: { className?: string }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={cn("relative mt-auto w-full px-8 pb-8 pt-12 md:px-16", className)}>
      <div className="absolute left-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />

      <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
        <div className="flex items-center gap-6">
          <Link href="/" className="opacity-50 transition-opacity hover:opacity-100">
            <Image
              src="/assets/app-logo.png"
              alt="Logo"
              width={32}
              height={32}
              className="grayscale"
            />
          </Link>

          <div className="flex flex-col">
            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
              © {currentYear} Training System
            </p>
            <Link
              href="https://github.com/david-dot-tsx"
              target="_blank"
              className="group flex items-center gap-1.5 text-[10px] font-medium text-zinc-600 transition-colors hover:text-amber-400"
            >
              <Github className="size-3" />
              <span>
                Developed by{" "}
                <span className="text-zinc-400 transition-colors group-hover:text-amber-400">
                  david-dot-tsx
                </span>
              </span>
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-8">
          <FooterLink href="#" icon={<ShieldCheck className="size-3" />}>
            Privacy
          </FooterLink>
          <FooterLink href="#" icon={<Globe className="size-3" />}>
            Terms
          </FooterLink>
          <FooterLink
            href="#"
            icon={
              <div className="size-1 rounded-full bg-amber-400 shadow-[0_0_5px_rgba(251,191,36,0.5)]" />
            }
          >
            Contact
          </FooterLink>
        </div>
      </div>

      <div className="mt-8 flex justify-center">
        <div className="h-px w-12 bg-amber-400/20" />
      </div>
    </footer>
  );
};

const FooterLink = ({
  href,
  children,
  icon,
}: {
  href: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
}) => (
  <Link
    href={href}
    className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 transition-all hover:text-zinc-200"
  >
    {icon}
    {children}
  </Link>
);

import Link from "next/link";
import Image from "next/image";

import { cn } from "@/lib/utils";

export const Footer = ({ className }: { className?: string }) => {
  return (
    <footer className={cn("border-t border-t-amber-400/10 px-16", className)}>
      <div className="flex h-6 flex-row items-center justify-between">
        <div className="flex flex-row items-center gap-4">
          <Link href="/">
            <Image src="/assets/app-logo.png" alt="Logo" width={40} height={40} />
          </Link>
          <Link
            href="https://github.com/david-dot-tsx"
            target="_blank"
            className="text-xs text-muted-foreground"
          >
            Created by david-dot-tsx
          </Link>
        </div>
        <div className="flex flex-row items-center gap-2 text-sm text-muted-foreground">
          <Link href="#" className="hover:text-muted">
            Privacy
          </Link>
          <Link href="#" className="hover:text-muted">
            Terms
          </Link>
          <Link href="#" className="hover:text-muted">
            Contact
          </Link>
        </div>
      </div>
    </footer>
  );
};

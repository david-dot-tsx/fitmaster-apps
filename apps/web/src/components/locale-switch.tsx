"use client";

import { Globe } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { type ResourceKey } from "i18next";

import { getTKey, type Locale, LOCALES } from "@repo/i18n/web";

import { useT } from "@/lib/i18n/i18n";
import { updateLocaleCookieAction } from "@/actions/locale.actions";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const locales: { code: Locale; name: ResourceKey; flag: string }[] = [
  { code: LOCALES.EN, name: getTKey("common:languages.english"), flag: "🇺🇸" },
  { code: LOCALES.PL, name: getTKey("common:languages.polish"), flag: "🇵🇱" },
  { code: LOCALES.ES, name: getTKey("common:languages.spanish"), flag: "🇪🇸" },
] as const;

export function LocaleSwitch() {
  const { i18n, t } = useT();
  const router = useRouter();
  const currentPathname = usePathname();
  const currentLocale = i18n.language;

  const handleLocaleChange = async (newLocale: string) => {
    await updateLocaleCookieAction(newLocale as Locale, currentPathname);
    router.push(currentPathname.replace(`/${currentLocale}`, `/${newLocale}`));
  };

  const activeLocale = locales.find((l) => l.code === currentLocale);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 gap-2 px-2 text-zinc-400 hover:bg-zinc-900 hover:text-amber-400"
        >
          <Globe className="size-4" />
          <span className="text-[10px] font-black uppercase tracking-widest">
            {activeLocale?.code}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="border-zinc-800 bg-zinc-950 text-zinc-400">
        {locales.map((locale) => (
          <DropdownMenuItem
            key={locale.code}
            onClick={() => handleLocaleChange(locale.code)}
            className="gap-2 text-xs font-bold hover:bg-zinc-900 focus:bg-zinc-900 focus:text-amber-400"
          >
            <span>{locale.flag}</span>
            <span>{t(locale.name)}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

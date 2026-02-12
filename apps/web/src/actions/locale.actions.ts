"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { addYears } from "date-fns";

import type { Locale } from "@repo/i18n/web";

import { COOKIES_NAMES } from "@/consts/cookies";

export async function updateLocaleCookieAction(newLocale: Locale, currentPathname: string) {
  const cookieStore = await cookies();

  cookieStore.set(COOKIES_NAMES.LOCALE, newLocale, {
    path: "/",
    expires: addYears(Date.now(), 1),
  });
  revalidatePath(currentPathname);
}

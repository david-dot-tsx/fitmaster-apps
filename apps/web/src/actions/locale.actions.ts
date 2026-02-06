"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { addYears } from "date-fns";

import type { Locale } from "@repo/i18n/web";

export async function updateLocaleCookieAction(newLocale: Locale, currentPathname: string) {
  const cookieStore = await cookies();

  cookieStore.set("locale", newLocale, {
    path: "/",
    expires: addYears(Date.now(), 1),
  });
  revalidatePath(currentPathname);
}

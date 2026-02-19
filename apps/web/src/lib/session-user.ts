"server-only";
import { cache } from "react";
import { cookies } from "next/headers";

import { AUTH_COOKIES_NAMES } from "@repo/api/cookies";
import { type UserBase, Role } from "@repo/validators";

import { trpcServerClient } from "@/lib/trpc/client-server";

const userWithAuthorizations = (user?: UserBase) => {
  return {
    user,
    isAuthenticated: !!user,
    isAdmin: user?.role === Role.ADMIN,
    isTrainer: user?.role === Role.TRAINER,
    isCustomer: user?.role === Role.CUSTOMER,
    isStaff: user?.role === Role.ADMIN || user?.role === Role.TRAINER,
  };
};

export const getSessionUser = cache(async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIES_NAMES.TOKEN)?.value;
  const refreshToken = cookieStore.get(AUTH_COOKIES_NAMES.REFRESH_TOKEN)?.value;
  let user: UserBase | undefined;

  try {
    if (token && refreshToken) {
      user = await trpcServerClient.user.me.query();
    }
  } catch (_error) {
    user = undefined;
  }

  return userWithAuthorizations(user);
});

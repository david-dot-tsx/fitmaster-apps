"use client";
import React from "react";
import Link from "next/link";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { useT } from "@/lib/i18n/i18n";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/providers/auth/auth-provider";

export const NavbarAuth = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { session } = useAuth();
  const { t } = useT();

  // TODO: Tanstack query: To refactor to queryfactory
  const { mutate: logout } = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message);
      }

      return res.json();
    },
    onSettled: async () => {
      router.refresh();
      queryClient.clear();
      router.push("/");
    },
    onError: (error) => {
      console.error("Logout error:", error.message);
      router.push("/");
    },
  });

  return (
    <div className="flex flex-row items-center gap-1 sm:gap-3">
      {session ? (
        <Button
          variant="ghost"
          size="sm"
          className="text-[10px] font-medium uppercase tracking-widest text-zinc-500 hover:bg-red-400/10 hover:text-red-400"
          onClick={() => logout()}
        >
          {t("logout")}
        </Button>
      ) : (
        <>
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="text-[10px] font-medium uppercase tracking-widest text-zinc-400"
          >
            <Link href="/auth/login">{t("login")}</Link>
          </Button>
          <Button
            asChild
            size="sm"
            className="bg-amber-400 text-[10px] font-medium uppercase tracking-widest text-black shadow-[0_0_15px_rgba(251,191,36,0.2)] hover:bg-amber-500"
          >
            <Link href="/auth/register">{t("register")}</Link>
          </Button>
        </>
      )}
    </div>
  );
};

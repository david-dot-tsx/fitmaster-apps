"use client";
import React from "react";
import Link from "next/link";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/providers/auth/auth-provider";

export const NavbarAuth = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { session } = useAuth();

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
    <div className="flex flex-row gap-2">
      {session ? (
        <Button onClick={() => logout()}>Logout</Button>
      ) : (
        <>
          <Button asChild>
            <Link href="/auth/login">Login</Link>
          </Button>
          <Button asChild>
            <Link href="/auth/register">Register</Link>
          </Button>
        </>
      )}
    </div>
  );
};

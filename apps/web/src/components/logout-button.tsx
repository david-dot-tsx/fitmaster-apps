"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export const LogoutButton = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  // TODO: Tanstack query: To refactor to queryfactory
  const { mutate: logout, status } = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Błąd logowania");
      }

      return res.json();
    },
    onSuccess: async () => {
      queryClient.clear();
      router.push("/");
    },
    onError: (error) => {
      console.error("Logout error:", error.message);
      router.push("/login");
    },
  });

  return (
    <button
      onClick={() => logout()}
      disabled={status === "pending"}
      className="rounded-md bg-red-500 p-2 text-white hover:bg-red-600 disabled:opacity-50"
    >
      {status === "pending" ? "Logging out..." : "Logout"}
    </button>
  );
};

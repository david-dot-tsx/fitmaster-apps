"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { useTRPC } from "@/lib/trpc/client";
import { LogoutButton } from "@/components/logout-button";

export const UserDetails = () => {
  const trpc = useTRPC();
  const { data: me, isLoading, error, refetch } = useQuery(trpc.user.me.queryOptions());
  const router = useRouter();

  return (
    <div>
      <div>
        <h2>User Details</h2>
        <pre>{JSON.stringify(me, null, 2)}</pre>
        <pre>{JSON.stringify(isLoading, null, 2)}</pre>
        <pre>{JSON.stringify(error, null, 2)}</pre>
      </div>
      <div className="flex gap-4">
        <button
          onClick={() => void refetch()}
          className="rounded-md bg-blue-500 p-2 text-white hover:bg-blue-600"
        >
          Refetch
        </button>
        <button
          onClick={() => router.push("/auth/login")}
          className="rounded-md bg-blue-500 p-2 text-white hover:bg-blue-600"
        >
          Login
        </button>
        <LogoutButton />
      </div>
    </div>
  );
};

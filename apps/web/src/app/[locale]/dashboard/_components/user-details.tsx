"use client";

import { useQuery } from "@tanstack/react-query";

import { useTRPC } from "@/lib/trpc/client";

export const UserDetails = () => {
  const trpc = useTRPC();
  const { data: me, isLoading, error } = useQuery(trpc.user.me.queryOptions());

  return (
    <div>
      <div>
        <h2>User Details Response</h2>
        <span>repsonse:</span>
        <pre>{JSON.stringify(me, null, 2)}</pre>
        <span>isLoading:</span>
        <pre>{JSON.stringify(isLoading, null, 2)}</pre>
        <span>error:</span>
        <pre>{JSON.stringify(error, null, 2)}</pre>
      </div>
    </div>
  );
};

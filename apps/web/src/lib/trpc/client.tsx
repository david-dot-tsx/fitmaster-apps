"use client";
// ^-- to make sure we can mount the Provider from a server component

import superjson from "superjson";
import { QueryClientProvider, type QueryClient } from "@tanstack/react-query";
import { createTRPCClient, httpBatchLink } from "@trpc/client";
import { createTRPCContext } from "@trpc/tanstack-react-query";
import { useState } from "react";

import { type AppRouter } from "@repo/api/client";
import { API_HEADER_X_CLIENT_TYPES_VALUES, API_HEADERS_KEYS } from "@repo/api/headers";

import { env } from "@/env";
import { makeQueryClient } from "@/lib/trpc/query-client";

export const { TRPCProvider, useTRPC } = createTRPCContext<AppRouter>();

let browserQueryClient: QueryClient;
let refreshPromise: Promise<boolean> | null = null;

async function fetchWithRefresh(url: string | URL | Request, options: RequestInit | undefined) {
  let response = await fetch(url, { ...options, credentials: "include" });

  if (response.status === 401) {
    if (!refreshPromise) {
      refreshPromise = fetch("/api/auth/refresh", { method: "POST" })
        .then((res) => res.ok)
        .finally(() => {
          refreshPromise = null;
        });
    }

    const isRefreshed = await refreshPromise;

    if (isRefreshed) {
      response = await fetch(url, { ...options, credentials: "include" });
    } else {
      window.location.href = "/auth/login";
    }
  }

  return response;
}

function getQueryClient() {
  if (typeof window === "undefined") {
    return makeQueryClient();
  }

  if (!browserQueryClient) browserQueryClient = makeQueryClient();

  return browserQueryClient;
}

export function TRPCReactProvider(
  props: Readonly<{
    children: React.ReactNode;
  }>,
) {
  const queryClient = getQueryClient();

  const [trpcClient] = useState(() =>
    createTRPCClient<AppRouter>({
      links: [
        httpBatchLink({
          transformer: superjson,
          url: env.NEXT_PUBLIC_API_URL + env.NEXT_PUBLIC_API_TRPC_PATH,
          fetch: fetchWithRefresh,
          headers() {
            return {
              [API_HEADERS_KEYS.X_CLIENT_TYPE]: API_HEADER_X_CLIENT_TYPES_VALUES.WEB || undefined,
            };
          },
        }),
      ],
    }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
        {props.children}
      </TRPCProvider>
    </QueryClientProvider>
  );
}

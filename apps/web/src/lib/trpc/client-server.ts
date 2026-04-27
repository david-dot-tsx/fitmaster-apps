import "server-only"; // <-- ensure this file cannot be imported from the client
import { createTRPCClient, createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query";
import superjson from "superjson";
import { cookies } from "next/headers";
import { cache } from "react";

import { type AppRouter } from "@repo/api/client";

import { makeQueryClient } from "@/lib/trpc/query-client";
import { env } from "@/env";

// IMPORTANT: Create a stable getter for the query client that
//            will return the same client during the same request.
export const getQueryClient = cache(makeQueryClient);

export const trpcServerOptionsProxy = createTRPCOptionsProxy<AppRouter>({
  client: createTRPCClient({
    links: [
      httpBatchLink({
        url: env.NEXT_PUBLIC_API_URL + env.NEXT_PUBLIC_API_TRPC_PATH,
        transformer: superjson,
        async headers() {
          const cookieStore = await cookies();

          return {
            cookie: cookieStore.toString(),
            credentials: "include",
          };
        },
      }),
    ],
  }),
  queryClient: getQueryClient,
});

export const trpcServerClient = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: env.NEXT_PUBLIC_API_URL + env.NEXT_PUBLIC_API_TRPC_PATH,
      transformer: superjson,
      async headers() {
        const cookieStore = await cookies();

        return {
          cookie: cookieStore.toString(),
          credentials: "include",
        };
      },
    }),
  ],
});

"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { useMemo } from "react";

import { trpc } from "./trpc";
import { type DeviceInfo } from "../server/types";

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // With SSR, we usually want to set some default staleTime
        // above 0 to avoid refetching immediately on the client
        staleTime: 60 * 1000,
      },
    },
  });
}
let browserQueryClient: QueryClient | undefined = undefined;
function getQueryClient() {
  if (typeof window === "undefined") {
    // Server: always make a new query client
    return makeQueryClient();
  } else {
    // Browser: make a new query client if we don't already have one
    // This is very important, so we don't re-make a new client if React
    // suspends during the initial render. This may not be needed if we
    // have a suspense boundary BELOW the creation of the query client
    if (!browserQueryClient) browserQueryClient = makeQueryClient();

    return browserQueryClient;
  }
}
interface ApiQueryProviderProps {
  children: React.ReactNode;
  url: string;
  token: string | null;
  deviceInfo: DeviceInfo;
}

export function ApiQueryProvider({ children, url, token, deviceInfo }: ApiQueryProviderProps) {
  const queryClient = getQueryClient();
  const trpcClient = useMemo(
    () =>
      trpc.createClient({
        links: [
          httpBatchLink({
            url,
            headers() {
              return {
                "x-device-name": deviceInfo.name,
                "x-device-os": deviceInfo.os,
                ...(token && { authorization: `Bearer ${token}` }),
              };
            },
          }),
        ],
      }),
    [url, token, deviceInfo.name, deviceInfo.os],
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  );
}

import superjson from "superjson";
import { QueryClientProvider, type QueryClient } from "@tanstack/react-query";
import { createTRPCClient, httpBatchLink } from "@trpc/client";
import { useMemo } from "react";
import { type CreateTRPCReact, createTRPCReact } from "@trpc/react-query";
import { DevToolsBubble } from "react-native-react-query-devtools";
import * as Device from "expo-device";

import { type AppRouter } from "@repo/api/client";
import { API_HEADERS_KEYS, API_HEADER_X_CLIENT_TYPES_VALUES } from "@repo/api/headers";
import { authRefreshTokenOutputSchema } from "@repo/validators";

import { env } from "@/env";
import { makeQueryClient } from "@/lib/trpc/query-client";
import { useAuthStoreActions, useAuthStoreState } from "@/providers/auth/auth.store";

export const trpc: CreateTRPCReact<AppRouter, unknown> = createTRPCReact<AppRouter>();

let browserQueryClient: QueryClient;

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
  const { token, refreshToken } = useAuthStoreState();
  const { setAuthenticated, setUnauthenticated } = useAuthStoreActions();

  const trpcClient = useMemo(
    () =>
      createTRPCClient<AppRouter>({
        links: [
          httpBatchLink({
            transformer: superjson,
            url: env.EXPO_PUBLIC_API_URL + env.EXPO_PUBLIC_API_TRPC_PATH,
            async fetch(url, options) {
              const response = await fetch(url, {
                ...options,
                credentials: "omit", // TODO: Change to "include" when the backend is ready
              });
              if (response.status === 401) {
                const refreshTokensResponse = await fetch(
                  `${env.EXPO_PUBLIC_API_URL}${env.EXPO_PUBLIC_API_TRPC_PATH}/auth.refreshToken`,
                  {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ json: { refreshToken: refreshToken } }),
                  },
                );
                const data = await refreshTokensResponse.json();

                const { success: parseTokensSuccess, data: parseTokensData } =
                  authRefreshTokenOutputSchema.safeParse(data.result.data.json);

                if (parseTokensSuccess) {
                  await setAuthenticated(parseTokensData.token, parseTokensData.refreshToken);
                  const refetchedResponse = await fetch(url, {
                    ...options,
                    headers: {
                      ...options?.headers,
                      Authorization: `Bearer ${parseTokensData.token}`,
                    },
                  });

                  return refetchedResponse;
                } else {
                  await setUnauthenticated();
                }
              }

              return response;
            },
            headers() {
              return {
                Authorization: token ? `Bearer ${token}` : undefined,
                [API_HEADERS_KEYS.X_CLIENT_TYPE]:
                  API_HEADER_X_CLIENT_TYPES_VALUES.MOBILE || undefined,
                [API_HEADERS_KEYS.X_DEVICE_NAME]: `${Device.modelName} ${Device.modelId}`,
                [API_HEADERS_KEYS.X_DEVICE_OS]: Device.osName || undefined,
              };
            },
          }),
        ],
      }),
    [refreshToken, setAuthenticated, setUnauthenticated, token],
  );

  return (
    <QueryClientProvider client={queryClient}>
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        {props.children}
        <DevToolsBubble queryClient={queryClient} />
      </trpc.Provider>
    </QueryClientProvider>
  );
}

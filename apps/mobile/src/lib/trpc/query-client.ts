import { defaultShouldDehydrateQuery, QueryClient } from "@tanstack/react-query";
import { serialize, deserialize } from "superjson";

export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
      dehydrate: {
        serializeData: serialize,
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) || query.state.status === "pending",
      },
      hydrate: {
        deserializeData: deserialize,
      },
    },
  });
}

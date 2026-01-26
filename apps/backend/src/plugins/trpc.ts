import fp from "fastify-plugin";
import { fastifyTRPCPlugin } from "@trpc/server/adapters/fastify";

import { appRouter } from "@repo/api/server";

import { createTrpcFastifyContext } from "@/lib/trpc";
import { env } from "@/env";

export default fp(async (server) => {
  await server.register(fastifyTRPCPlugin, {
    prefix: `/${env.TRPC_PATH}`,
    trpcOptions: {
      router: appRouter,
      createContext: createTrpcFastifyContext,
      onError({ path, error }: { path?: string; error: Error }) {
        server.log.error(error, `Error in tRPC handler on path '${path ?? "unknown"}'`);
      },
    },
  });
});

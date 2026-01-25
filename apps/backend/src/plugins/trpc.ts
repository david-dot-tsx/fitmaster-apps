import fp from "fastify-plugin";
import { fastifyTRPCPlugin } from "@trpc/server/adapters/fastify";

import { appRouter } from "@repo/api/server";

import { createTrpcFastifyContext } from "@/lib/trpc";

export default fp(async (server) => {
  await server.register(fastifyTRPCPlugin, {
    prefix: "/trpc",
    trpcOptions: {
      router: appRouter,
      context: createTrpcFastifyContext,
      onError({ path, error }: { path?: string; error: Error }) {
        server.log.error(error, `Error in tRPC handler on path '${path ?? "unknown"}'`);
      },
    },
  });
});

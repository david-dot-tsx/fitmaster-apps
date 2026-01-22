import { fastifyTRPCPlugin } from "@trpc/server/adapters/fastify";
import cors from "@fastify/cors";
import Fastify from "fastify";

import { appRouter } from "@repo/api/server";

import { env } from "@/env";
import { createTrpcFastifyContext } from "@/lib/trpc";

const server = Fastify({
  logger: {
    level: env.NODE_ENV === "production" ? "info" : "debug",
  },
  maxParamLength: 5000,
});

// Register CORS
await server.register(cors, {
  origin: env.CORS_ORIGIN,
  credentials: true,
});

// Register tRPC plugin
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

// Health check endpoint
server.get("/health", async () => {
  return { status: "ok", timestamp: new Date().toISOString() };
});

// Start server
const start = async () => {
  try {
    await server.listen({ port: env.PORT, host: env.HOST });
    server.log.info(`🚀 API server running on http://${env.HOST}:${env.PORT}`);
    server.log.info(`📡 tRPC endpoint: http://${env.HOST}:${env.PORT}/trpc`);
    server.log.info(`❤️  Health check: http://${env.HOST}:${env.PORT}/health`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();

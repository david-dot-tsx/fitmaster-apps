import Fastify from "fastify";

import { env } from "@/env";
import zodPlugin from "@/plugins/zod";
import authPlugin from "@/plugins/auth";
import swaggerPlugin from "@/plugins/swagger";
import corsPlugin from "@/plugins/cors";
import trpcPlugin from "@/plugins/trpc";

const server = Fastify({
  logger: {
    level: env.NODE_ENV === "production" ? "info" : "debug",
  },
  maxParamLength: 5000,
});

await server.register(zodPlugin);
await server.register(authPlugin);
await server.register(swaggerPlugin);
await server.register(corsPlugin);
await server.register(trpcPlugin);

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

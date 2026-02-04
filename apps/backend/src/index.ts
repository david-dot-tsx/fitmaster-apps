import Fastify from "fastify";

import { env } from "@/env";
import zodPlugin from "@/plugins/zod";
import authPlugin from "@/plugins/auth";
import swaggerPlugin from "@/plugins/swagger";
import corsPlugin from "@/plugins/cors";
import trpcPlugin from "@/plugins/trpc";
import cookiePlugin from "@/plugins/cookie";

const server = Fastify({
  logger: {
    level: env.NODE_ENV === "production" ? "info" : "debug",
  },
  maxParamLength: 5000,
});

await server.register(zodPlugin);
await server.register(authPlugin);
await server.register(corsPlugin);
await server.register(cookiePlugin);
await server.register(trpcPlugin);
await server.register(swaggerPlugin);

// Health check endpoint
server.get("/health", async () => {
  return {
    status: "ok",
    timestamp: new Date().toISOString(),
  };
});

// Start server
const start = async () => {
  try {
    await server.listen({ port: env.PORT, host: env.HOST });
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();

import "dotenv/config";

import { fastifyTRPCPlugin } from "@trpc/server/adapters/fastify";
import cors from "@fastify/cors";
import Fastify from "fastify";

import { appRouter } from "@/routers/index.js";
import { createContext } from "@/trpc.js";

const PORT = process.env.PORT ? Number.parseInt(process.env.PORT, 10) : 3001;
const HOST = process.env.HOST ?? "0.0.0.0";

const server = Fastify({
  logger: {
    level: process.env.NODE_ENV === "production" ? "info" : "debug",
  },
  maxParamLength: 5000,
});

// Register CORS
await server.register(cors, {
  origin: process.env.CORS_ORIGIN ?? "*",
  credentials: true,
});

// Register tRPC plugin
await server.register(fastifyTRPCPlugin, {
  prefix: "/trpc",
  trpcOptions: {
    router: appRouter,
    createContext,
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
    await server.listen({ port: PORT, host: HOST });
    server.log.info(`🚀 API server running on http://${HOST}:${PORT}`);
    server.log.info(`📡 tRPC endpoint: http://${HOST}:${PORT}/trpc`);
    server.log.info(`❤️  Health check: http://${HOST}:${PORT}/health`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();

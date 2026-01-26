import fp from "fastify-plugin";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";

import { generateOpenApiDocument, fastifyTRPCOpenApiPlugin, appRouter } from "@repo/api/server";

import { createTrpcFastifyContext } from "@/lib/trpc";

export default fp(async (server) => {
  const openApiDocument = generateOpenApiDocument(appRouter, {
    title: "FitMaster API",
    version: "3.0.0",
    baseUrl: "http://localhost:3001/trpc",
    openApiVersion: "3.0.0",
  });

  await server.register(fastifyTRPCOpenApiPlugin, {
    basePath: "/trpc",
    router: appRouter,
    createContext: createTrpcFastifyContext,
  });

  server.get("/openapi.json", () => openApiDocument);

  await server.register(swagger, {
    mode: "static",
    specification: {
      //TODO: Fix this type
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      document: openApiDocument as any,
    },
  });

  await server.register(swaggerUi, {
    routePrefix: "/docs",
  });
});

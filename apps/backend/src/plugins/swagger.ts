import fp from "fastify-plugin";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import { jsonSchemaTransform } from "fastify-type-provider-zod";

import { version } from "../../package.json";

export default fp(async (server) => {
  await server.register(swagger, {
    openapi: {
      openapi: "3.0.0",
      info: {
        title: "Test swagger",
        description: "Testing the Fastify swagger API",
        version: version,
      },
      tags: [
        { name: "Users", description: "User related end-points" },
        { name: "Products", description: "Product related end-points" },
      ],
    },
    transform: jsonSchemaTransform,
  });

  await server.register(swaggerUi, {
    routePrefix: "/docs",
  });
});

import fp from "fastify-plugin";
import fastifyJwt from "@fastify/jwt";
import { type FastifyReply, type FastifyRequest } from "fastify";

import { env } from "@/env";

declare module "fastify" {
  export interface FastifyInstance {
    // TODO: resolve any type
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    authenticate: any;
  }
}

declare module "@fastify/jwt" {
  interface FastifyJWT {
    user: { id: number; email: string; name: string };
  }
}

export default fp(async (server) => {
  server.register(fastifyJwt, {
    secret: env.JWT_SECRET,
  });

  server.decorate("authenticate", async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      await request.jwtVerify();
    } catch (err) {
      reply.send(err);
    }
  });
});

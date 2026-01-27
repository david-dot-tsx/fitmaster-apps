import fp from "fastify-plugin";
import fastifyJwt from "@fastify/jwt";
import { type FastifyReply, type FastifyRequest } from "fastify";

import { type SessionUser } from "@repo/api/server";

import { env } from "@/env";

declare module "fastify" {
  export interface FastifyInstance {
    authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
}

declare module "@fastify/jwt" {
  interface FastifyJWT {
    sessionUser: SessionUser;
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

import type { PrismaClient } from "../../generated/prisma/client";

export interface SeederContext {
  prisma: PrismaClient;
}

export interface Seeder {
  name: string;
  description: string;
  defaultCount: number;
  run(ctx: SeederContext, count: number): Promise<void>;
}

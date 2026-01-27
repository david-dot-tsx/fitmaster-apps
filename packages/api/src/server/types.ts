import { z } from "zod";

import { type PrismaClient, Role } from "@repo/db";

export const sessionUserSchema = z.object({
  id: z.string(),
  email: z.string(),
  role: z.enum(Role),
});
export type SessionUser = z.infer<typeof sessionUserSchema>;

export type DeviceInfo = {
  name?: string;
  os?: string;
};

export type SignToken = (payload: SessionUser) => Promise<string>;

export interface TRPCContext {
  prisma: PrismaClient;
  sessionUser: SessionUser | null;
  client: {
    userAgent?: string;
    ip: string;
    deviceInfo: DeviceInfo;
  };
  utils: {
    signToken: SignToken;
  };
  config: {
    refreshTokenExpiresInDays: number;
  };
}

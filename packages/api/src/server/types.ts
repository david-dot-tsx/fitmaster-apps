import type { Role } from "@repo/db";

export type SessionUser = {
  id: string;
  email: string;
  role: Role;
};

export type SignToken = (payload: SessionUser) => Promise<string>;

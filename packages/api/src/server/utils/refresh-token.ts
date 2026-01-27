import { createHash, randomBytes } from "crypto";

export const generateRefreshToken = () => {
  return randomBytes(64).toString("hex");
};

export const hashRefreshToken = (refreshToken: string) => {
  return createHash("sha256").update(refreshToken).digest("hex");
};

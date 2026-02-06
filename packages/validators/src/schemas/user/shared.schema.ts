import z from "zod";

export const userBaseSchema = z.object({
  id: z.string(),
  email: z.string(),
  role: z.string(),
  createdAt: z.date(),
});
export type UserBase = z.infer<typeof userBaseSchema>;

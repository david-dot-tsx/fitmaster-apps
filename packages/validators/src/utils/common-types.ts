import z from "zod";

export const idSchema = z.uuid();
export type Id = z.infer<typeof idSchema>;

export const timestampsSchema = z.object({
  createdAt: z.date(),
  updatedAt: z.date(),
});
export type Timestamps = z.infer<typeof timestampsSchema>;

import z from "zod";

import { idSchema } from "./common-types";

export const withIdSchema = z.object({ id: idSchema });

export const withTimestampsSchema = z.object({ createdAt: z.date(), updatedAt: z.date() });

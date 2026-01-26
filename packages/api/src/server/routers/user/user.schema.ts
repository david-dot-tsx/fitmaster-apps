import z from "zod";

export const userCredentialsSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const userSchema = z.object({
  id: z.string(),
  email: z.string(),
  role: z.string(),
  createdAt: z.date(),
});

export const userCreateInputSchema = userCredentialsSchema;
export const userLoginInputSchema = userCredentialsSchema;

export const userCreateOutputSchema = userSchema;

export const userLoginOutputSchema = z.object({
  token: z.string(),
});

export const userGetByIdInputSchema = z.object({
  id: z.string(),
});
export const userGetByIdOutputSchema = userSchema;

export const userMeOutputSchema = userSchema.extend({
  profile: z
    .object({
      id: z.string(),
      nickname: z.string().nullable(),
      firstName: z.string().nullable(),
      lastName: z.string().nullable(),
    })
    .nullable(),
});

export const userListOutputSchema = z.array(userSchema);

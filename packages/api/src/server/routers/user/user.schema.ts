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

export const userTokensSchema = z.object({
  token: z.string(),
  refreshToken: z.string(),
});

export const userRefreshTokenInputSchema = z.object({
  refreshToken: z.string(),
});

export const userLogoutInputSchema = z.object({
  refreshToken: z.string(),
});

export const userLogoutOutputSchema = z.void();

export const userRefreshTokenOutputSchema = userTokensSchema;

export const userCreateInputSchema = userCredentialsSchema;
export const userLoginInputSchema = userCredentialsSchema;

export const userCreateOutputSchema = userSchema;

export const userLoginOutputSchema = userTokensSchema;

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

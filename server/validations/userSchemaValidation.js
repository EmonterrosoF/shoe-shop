import { z } from "zod";

export const registerSchema = z.object({

  body: z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  }),
});
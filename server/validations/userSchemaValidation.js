import { z } from "zod";

// para body
export const registerUserSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(6),
});

// para body
export const loginUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

// para body
export const updateUserSchema = z.object({
  name: z.string().optional(),
  email: z.string().email().optional(),
  password: z.string().min(6).optional(),
});

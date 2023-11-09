import { z } from "zod";

// para body
export const registerUserSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  email: z.string().email("Email incorrecto"),
  password: z
    .string()
    .min(6, "La contraseña tiene que tener un minimo de 6 caracteres"),
});

// para body
export const loginUserSchema = z.object({
  email: z.string().email("Email incorrecto"),
  password: z.string().min(1, "La contraseña es requerida"),
});

// para body
export const updateUserSchema = z.object({
  name: z.string().optional(),
  email: z.string().email("Email incorrecto").optional(),
  password: z
    .string()
    .min(6, "La contraseña tiene que tener un minimo de 6 caracteres")
    .optional(),
});

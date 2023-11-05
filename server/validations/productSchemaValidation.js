import { z } from "zod";

// para body
export const reviewProductSchema = z.object({
  rating: z.string(),
  comment: z.string(),
});

// para body
export const createProductSchema = z.object({
  name: z.string(),
  price: z.string(),
  description: z.string(),
  image: z.string(),
  countInStock: z.string(),
});

// para body
export const updateProductSchema = z.object({
  name: z.string().optional(),
  price: z.number().optional(),
  description: z.string().optional(),
  image: z.string().optional(),
  countInStock: z.number().optional(),
});

// para querys
export const queryProductSchema = z.object({
  pageNumber: z
    .string()
    .regex(new RegExp(/^[0-9]+$/))
    .default("1"),
  keyword: z.string().default(""),
});

// para params
export const paramsProductSchema = z.object({
  id: z.string().regex(new RegExp(/^[0-9a-fA-F]{24}$/)),
});

import { z } from "zod";

// para body
export const createCategorySchema = z.object({
  name: z.string(),
  description: z.string(),
});

// para body
export const updateCategorySchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
});

// para querys
export const queryCategorySchema = z.object({
  pageNumber: z
    .string()
    .regex(new RegExp(/^[0-9]+$/))
    .default("1"),
  keyword: z.string().default(""),
});

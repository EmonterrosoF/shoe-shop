import { z } from "zod";

export const queryProductSchema = z.object({
  pageNumber: z.string().default("1"),
  keyword: z.string().optional(),
});

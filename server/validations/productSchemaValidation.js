import { z } from "zod";

// para body
export const reviewProductSchema = z.object({
  rating: z.string(),
  comment: z.string(),
});

// para body
export const createProductSchema = z.object({
  name: z.string(),
  price: z
    .string()
    .regex(
      new RegExp(/^(?=.*[1-9])\d*\.?\d{0,2}$/),
      "El precio tiene que ser mayor a 0 o con dos decimales"
    ),
  description: z.string(),
  // image: z.object(),
  countInStock: z
    .string()
    .regex(new RegExp(/^[1-9]+$/), "El stock tiene que ser mayor a 0 y entero"),
  category: z
    .string()
    .regex(new RegExp(/^[0-9a-fA-F]{24}$/), "Selecciona una Categoria valida"),
});

// para body
export const updateProductSchema = z.object({
  name: z.string().optional(),
  price: z
    .string()
    .regex(
      new RegExp(/^(?=.*[1-9])\d*\.?\d{0,2}$/),
      "El precio tiene que ser mayor a 0 o con dos decimales"
    )
    .optional(),
  description: z.string().optional(),
  image: z.string().optional(),
  countInStock: z
    .string()
    .regex(new RegExp(/^[0-9]+$/), "El stock tiene que ser entero")
    .optional(),
  category: z
    .string()
    .regex(new RegExp(/^[0-9a-fA-F]{24}$/), "Selecciona una Categoria valida")
    .optional(),
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

// para file
export const fileProductSchema = z.object(
  {
    fieldname: z.string(),
    originalname: z.string(),
    encoding: z.string(),
    mimetype: z.string(),
    buffer: z.custom(Buffer),
  },
  {
    required_error: "la imagen es requerida",
  }
);

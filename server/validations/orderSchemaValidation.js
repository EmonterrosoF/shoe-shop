import { z } from "zod";

// para body
export const createOrderSchema = z.object({
  orderItems: z.array({
    name: z.string(),
    qty: z.number(),
    image: z.string(),
    price: z.number(),
    product: z.string(),
  }),
  shippingAddress: z.object({
    address: z.string(),
    city: z.string(),
    postalCode: z.string(),
    country: z.string(),
  }),
  paymentMethod: z.string().optional(),
  shippingPrice: z.number(),
  totalPrice: z.number(),
});

// para body
// export const updateProductSchema = z.object({
//   name: z.string().optional(),
//   price: z.number().optional(),
//   description: z.string().optional(),
//   image: z.string().optional(),
//   countInStock: z.number().optional(),
// });

// // para querys
// export const queryProductSchema = z.object({
//   pageNumber: z
//     .string()
//     .regex(new RegExp(/^[0-9]+$/))
//     .default("1"),
//   keyword: z.string().default(""),
// });

// // para params
// export const paramsProductSchema = z.object({
//   id: z.string().regex(new RegExp(/^[0-9a-fA-F]{24}$/)),
// });

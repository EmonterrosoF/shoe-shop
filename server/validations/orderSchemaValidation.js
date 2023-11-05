import { z } from "zod";

// para body
export const createOrderSchema = z.object({
  orderItems: z.array(
    z.object({
      name: z.string(),
      qty: z.number(),
      image: z.string(),
      price: z.number(),
      product: z.string().regex(new RegExp(/^[0-9a-fA-F]{24}$/)),
    })
  ),
  shippingAddress: z.object({
    address: z.string(),
    city: z.string(),
    postalCode: z.string(),
    country: z.string(),
  }),
  paymentMethod: z.string().optional(),
  shippingPrice: z.string(),
  totalPrice: z.string(),
});

// para body
export const payOrderSchema = z.object({
  id: z.string(),
  status: z.string(),
  update_time: z.string(),
  // email_address: z.string(),
});

// para params
export const paramsOrderSchema = z.object({
  id: z.string().regex(new RegExp(/^[0-9a-fA-F]{24}$/)),
});

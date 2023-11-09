import express from "express";
import {
  protectedCustomer,
  protectedUser,
} from "../Middleware/AuthMiddleware.js";
import Order from "./../Models/OrderModel.js";
import { ValidateData } from "../Middleware/validationDataMiddleware.js";
import {
  createOrderSchema,
  paramsOrderSchema,
  payOrderSchema,
} from "../validations/orderSchemaValidation.js";

import Product from "../Models/ProductModel.js";

const router = express.Router();

// crear una orden de un producto
router.post(
  "/",
  ValidateData({ schema: createOrderSchema }),
  protectedCustomer,
  async (req, res, next) => {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      shippingPrice,
      totalPrice,
    } = req.body;

    try {
      if (orderItems && orderItems.length === 0) {
        res.status(400);
        const error = new Error("La orden no tiene productos");
        next(error);
        return;
      } else {
        const order = new Order({
          orderItems,
          user: req.user._id,
          shippingAddress,
          paymentMethod,
          shippingPrice,
          totalPrice,
        });

        const createOrder = await order.save();
        res.status(201).json(createOrder);
      }
    } catch (error) {
      console.log(error.message);
      const err = new Error("Error interno del servidor");
      next(err);
    }
  }
);

// obtener todas las ordenes de los clientes, solo usuarios permitidos
router.get("/all", protectedUser, async (req, res, next) => {
  try {
    const orders = await Order.find({})
      .sort({ _id: -1 })
      .populate("user", "id name email");
    res.json(orders);
  } catch (error) {
    console.log(error.message);
    const err = new Error("Error interno del servidor");
    next(err);
  }
});

// obtiene las ordenes de un cliente, pero el cliente tiene que estar logueado
router.get("/", protectedCustomer, async (req, res, next) => {
  try {
    const order = await Order.find({ user: req.user._id }).sort({ _id: -1 });
    res.json(order);
  } catch (error) {
    console.log(error.message);
    const err = new Error("Error interno del servidor");
    next(err);
  }
});

// obtener orden por id para los clientes
router.get(
  "/:id",
  ValidateData({ schema: paramsOrderSchema, type: "params" }),
  protectedCustomer,
  async (req, res, next) => {
    try {
      const order = await Order.findById(req.params.id).populate(
        "user",
        "name email"
      );

      if (order) {
        res.json(order);
      } else {
        res.status(404);
        const error = new Error("Orden no encontrada");
        next(error);
      }
    } catch (error) {
      console.log(error.message);
      const err = new Error("Error interno del servidor");
      next(err);
    }
  }
);

// obtener orden por id para los usuarios
router.get(
  "/user/:id",
  ValidateData({ schema: paramsOrderSchema, type: "params" }),
  protectedUser,
  async (req, res, next) => {
    try {
      const order = await Order.findById(req.params.id).populate(
        "user",
        "name email"
      );

      if (order) {
        res.json(order);
      } else {
        res.status(404);
        const error = new Error("Orden no encontrada");
        next(error);
      }
    } catch (error) {
      console.log(error.message);
      const err = new Error("Error interno del servidor");
      next(err);
    }
  }
);

// actualiza la orden, cuando la orden se paga
router.put(
  "/:id/pay",
  ValidateData({ schema: paramsOrderSchema, type: "params" }),
  ValidateData({ schema: payOrderSchema }),
  protectedCustomer,
  async (req, res, next) => {
    const { id, status, update_time, email_address } = req.body;
    try {
      const order = await Order.findById(req.params.id);
      if (order) {
        for (const item of order.orderItems) {
          const product = await Product.findById(item.product);

          if (item.qty > product.countInStock) {
            res.status(400);
            const err = new Error(
              `Error La cantidad del producto ${product?.name} es mayor que el stock ${product?.countInStock}`
            );
            next(err);
            return;
          }

          product.countInStock = product.countInStock - item.qty;

          await product.save();
        }

        order.isPaid = true;
        order.paidAt = Date.now();
        order.paymentResult = {
          id,
          status,
          update_time,
          email_address,
        };
        const updatedOrder = await order.save();

        res.json(updatedOrder);
      } else {
        res.status(404);
        const error = new Error("Orden no encontrada");
        next(error);
      }
    } catch (error) {
      console.log(error.message);
      const err = new Error("Error interno del servidor");
      next(err);
    }
  }
);

// actualiza la orden cuando ya esta pagada, y sirve cuando el producto fue entregado
router.put(
  "/:id/delivered",
  ValidateData({ schema: paramsOrderSchema, type: "params" }),
  protectedUser,
  async (req, res, next) => {
    try {
      const order = await Order.findById(req.params.id);

      if (order) {
        order.isDelivered = true;
        order.deliveredAt = Date.now();

        const updatedOrder = await order.save();
        res.json(updatedOrder);
      } else {
        res.status(404);
        const error = new Error("Orden no encontrada");
        next(error);
      }
    } catch (error) {
      console.log(error.message);
      const err = new Error("Error interno del servidor");
      next(err);
    }
  }
);

export default router;

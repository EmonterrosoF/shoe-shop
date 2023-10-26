import express from "express";
import asyncHandler from "express-async-handler";
import { admin, protectedCustomer } from "../Middleware/AuthMiddleware.js";
import generateToken from "../utils/generateToken.js";
import Customer from "../Models/CustomerModel.js";
import { ValidateData } from "../Middleware/validationDataMiddleware.js";
import {
  loginSchema,
  registerSchema,
} from "../validations/userSchemaValidation.js";

const router = express.Router();

// LOGIN
router.post("/login", ValidateData(loginSchema), async (req, res) => {
  const { email, password } = req.body;

  try {
    const customer = await Customer.findOne({ email });

    if (customer && (await Customer.matchPassword(password))) {
      res.json({
        _id: customer._id,
        name: customer.name,
        email: customer.email,
        token: generateToken(customer._id),
        createdAt: customer.createdAt,
      });
    } else {
      res.status(401);
      const error = new Error("Invalid Email or Password");
      next(error);
    }
  } catch (error) {
    console.log(error.message);
  }
});

// registrar cliente
router.post("/", ValidateData(registerSchema), async (req, res, next) => {
  const { name, email, password } = req.body;

  try {
    const customerExists = await Customer.findOne({ email });

    if (customerExists) {
      res.status(400);
      const error = new Error("user already exists");
      next(error);
    }

    const customer = await Customer.create({
      name,
      email,
      password,
    });

    res.status(201).json({
      _id: customer._id,
      name: customer.name,
      email: customer.email,
      token: generateToken(customer._id),
    });
  } catch (error) {
    console.log(error.message);
  }
});

// PROFILE
router.get(
  "/profile",
  protectedCustomer,
  asyncHandler(async (req, res) => {
    const customer = await Customer.findById(req.customer._id);

    if (customer) {
      res.json({
        _id: customer._id,
        name: customer.name,
        email: customer.email,
        isAdmin: customer.isAdmin,
        createdAt: customer.createdAt,
      });
    } else {
      res.status(404);
      throw new Error("customer not found");
    }
  })
);

// UPDATE PROFILE
router.put(
  "/profile",
  protectedCustomer,
  asyncHandler(async (req, res) => {
    const customer = await Customer.findById(req.customer._id);

    if (customer) {
      customer.name = req.body.name || customer.name;
      customer.email = req.body.email || customer.email;
      if (req.body.password) {
        customer.password = req.body.password;
      }
      const updatedcustomer = await Customer.save();
      res.json({
        _id: updatedcustomer._id,
        name: updatedcustomer.name,
        email: updatedcustomer.email,
        isAdmin: updatedcustomer.isAdmin,
        createdAt: updatedcustomer.createdAt,
        token: generateToken(updatedcustomer._id),
      });
    } else {
      res.status(404);
      throw new Error("customer not found");
    }
  })
);

// GET ALL customer ADMIN
router.get(
  "/",
  protectedCustomer,
  admin,
  asyncHandler(async (req, res) => {
    const customers = await Customer.find({});
    res.json(customers);
  })
);

export default router;

import express from "express";
import {
  admin,
  protectedCustomer,
  protectedUser,
} from "../Middleware/AuthMiddleware.js";
import generateToken from "../utils/generateToken.js";
import Customer from "../Models/CustomerModel.js";
import { ValidateData } from "../Middleware/validationDataMiddleware.js";
import {
  loginUserSchema,
  registerUserSchema,
  updateUserSchema,
} from "../validations/userSchemaValidation.js";

const router = express.Router();

// loguear cliente
router.post("/login", ValidateData({ schema: loginUserSchema }), async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const customer = await Customer.findOne({ email });

    const isMatchPassword = customer
      ? await customer.matchPassword(password)
      : false;

    if (customer && isMatchPassword) {
      res.json({
        _id: customer._id,
        name: customer.name,
        email: customer.email,
        token: generateToken(customer._id),
        createdAt: customer.customer,
      });
    } else {
      res.status(401);
      const error = new Error("Invalid Email or Password");
      next(error);
    }
  } catch (error) {
    console.log(error.message);
    const err = new Error("internal server error");
    next(err);
  }
});

// registrar cliente
router.post("/", ValidateData({ schema: registerUserSchema }), async (req, res, next) => {
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
    const err = new Error("internal server error");
    next(err);
  }
});

// obtener informacion del perfil
router.get("/profile", protectedCustomer, async (req, res, next) => {
  try {
    const customer = req.user;

    if (customer) {
      res.json({
        _id: customer._id,
        name: customer.name,
        email: customer.email,
        createdAt: customer.createdAt,
      });
    } else {
      res.status(404);
      const error = new Error("user not found");
      next(error);
    }
  } catch (error) {
    console.log(error.message);
    const err = new Error("internal server error");
    next(err);
  }
});

// actualizar el perfil del cliente
router.put(
  "/profile",
  ValidateData({ schema: updateUserSchema }),
  protectedCustomer,
  async (req, res, next) => {
    try {
      const customer = req.user;

      if (customer) {
        customer.name = req.body.name || customer.name;
        customer.email = req.body.email || customer.email;
        if (req.body.password) {
          customer.password = req.body.password;
        }
        const updatedcustomer = await customer.save();
        res.json({
          _id: updatedcustomer._id,
          name: updatedcustomer.name,
          email: updatedcustomer.email,
          createdAt: updatedcustomer.createdAt,
          token: generateToken(updatedcustomer._id),
        });
      } else {
        res.status(404);
        const error = new Error("user not found");
        next(error);
      }
    } catch (error) {
      console.log(error.message);
      const err = new Error("internal server error");
      next(err);
    }
  }
);

// obtener todos los clientes pero solo el usuario con rol de admin
router.get("/", protectedUser, admin, async (req, res) => {
  const customers = await Customer.find({}).select("-password");
  res.json(customers);
});

export default router;

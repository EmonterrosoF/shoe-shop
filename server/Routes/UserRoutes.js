import express from "express";
import { admin, protectedUser } from "../Middleware/AuthMiddleware.js";
import generateToken from "../utils/generateToken.js";
import User from "../Models/UserModel.js";
import { ValidateData } from "../Middleware/validationDataMiddleware.js";
import {
  loginUserSchema,
  registerUserSchema,
  updateUserSchema,
} from "../validations/userSchemaValidation.js";

import { paramsProductSchema } from "../validations/productSchemaValidation.js";

import bcrypt from "bcryptjs";

const router = express.Router();

// loguear usuario
router.post(
  "/login",
  ValidateData({ schema: loginUserSchema }),
  async (req, res, next) => {
    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });

      const isMatchPassword = user ? await user.matchPassword(password) : false;

      if (user && isMatchPassword) {
        res.json({
          _id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
          token: generateToken(user._id),
          createdAt: user.createdAt,
        });
      } else {
        res.status(401);
        const error = new Error("Email o contraseña incorrecta");
        next(error);
      }
    } catch (error) {
      console.log(error.message);
      const err = new Error("Error interno del servidor");
      next(err);
    }
  }
);

// registrar usuario
router.post(
  "/",
  ValidateData({ schema: registerUserSchema }),
  protectedUser,
  admin,
  async (req, res, next) => {
    const { name, email, password } = req.body;
    try {
      const userExists = await User.findOne({ email });

      if (userExists) {
        res.status(400);
        const error = new Error("El usuario ya existe");
        next(error);
      }

      const user = await User.create({
        name,
        email,
        password,
      });

      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user._id),
      });
    } catch (error) {
      console.log(error.message);
      const err = new Error("Error interno del servidor");
      next(err);
    }
  }
);

// obtener informacion del perfil
router.get("/perfile", protectedUser, async (req, res, next) => {
  try {
    const user = req.user;

    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        createdAt: user.createdAt,
      });
    } else {
      res.status(404);
      const error = new Error("Usuario no encontrado");
      next(error);
    }
  } catch (error) {
    console.log(error.message);
    const err = new Error("Error interno del servidor");
    next(err);
  }
});

// actualizar el perfil del usuario
router.put(
  "/perfile",
  ValidateData({ schema: updateUserSchema }),
  protectedUser,
  async (req, res, next) => {
    try {
      const user = req.user;

      if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        if (req.body.password) {
          user.password = req.body.password;
        }

        const updatedUser = await user.save();
        res.json({
          _id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          isAdmin: updatedUser.isAdmin,
          createdAt: updatedUser.createdAt,
          token: generateToken(updatedUser._id),
        });
      } else {
        res.status(404);
        const error = new Error("Usuario no encontrado");
        next(error);
      }
    } catch (error) {
      console.log(error.message);
      const err = new Error("Error interno del servidor");
      next(err);
    }
  }
);

// obtener usuario por id, pero solo puede el user admin
router.get(
  "/:id",
  ValidateData({ schema: paramsProductSchema, type: "params" }),
  protectedUser,
  admin,
  async (req, res, next) => {
    try {
      const user = await User.findById(req.params.id);

      if (user) {
        res.json({
          _id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
          createdAt: user.createdAt,
        });
      } else {
        res.status(404);
        const error = new Error("Usuario no encontrado");
        next(error);
      }
    } catch (error) {
      console.log(error.message);
      const err = new Error("Error interno del servidor");
      next(err);
    }
  }
);

// actualizar un usuario pero solo puede el user admin
router.put(
  "/:id",
  ValidateData({ schema: paramsProductSchema, type: "params" }),
  ValidateData({ schema: updateUserSchema }),
  protectedUser,
  admin,
  async (req, res, next) => {
    console.log(req.body);
    try {
      const user = await User.findById(req.params.id);

      if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        if (req.body.password) {
          user.password = req.body.password;
        }

        const updatedUser = await user.save();
        res.json({
          _id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          isAdmin: updatedUser.isAdmin,
          createdAt: updatedUser.createdAt,
          token: generateToken(updatedUser._id),
        });
      } else {
        res.status(404);
        const error = new Error("Usuario no encontrado");
        next(error);
      }
    } catch (error) {
      console.log(error.message);
      const err = new Error("Error interno del servidor");
      next(err);
    }
  }
);

// obtener todos los usuario pero solo el usuario con rol de admin
router.get("/", protectedUser, admin, async (req, res) => {
  const user = req.user;
  const users = await User.find({ _id: { $ne: user._id } })
    .sort({ _id: -1 })
    .select("-password");
  res.json(users);
});

// eliminar un usuario pero solo usuario admin
router.delete(
  "/:id",
  ValidateData({ schema: paramsProductSchema, type: "params" }),
  protectedUser,
  admin,
  async (req, res, next) => {
    try {
      const user = await User.findById(req.params.id);
      if (user) {
        await user.remove();
        res.json({ message: "Usuario Eliminado" });
      } else {
        res.status(404);
        const error = new Error("Usuario no encontrado");
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

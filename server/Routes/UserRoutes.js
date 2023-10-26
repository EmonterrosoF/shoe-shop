import express from "express";
import { admin, protectedUser } from "../Middleware/AuthMiddleware.js";
import generateToken from "../utils/generateToken.js";
import User from "../Models/UserModel.js";
import { ValidateData } from "../Middleware/validationDataMiddleware.js";
import { loginUserSchema, registerUserSchema } from "../validations/userSchemaValidation.js";

const userRouter = express.Router();

// loguear usuario
userRouter.post("/login", ValidateData(loginUserSchema), async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    const isMatchPassword = await user.matchPassword(password)

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
      const error = new Error("Invalid Email or Password");
      next(error)
    }

  } catch (error) {
    console.log(error.message)
    const err = new Error("internal server error")
    next(err)
  }

}
);

// registrar usuario
userRouter.post("/", protectedUser, admin, ValidateData(registerUserSchema), async (req, res, next) => {
  const { name, email, password } = req.body;
  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400);
      const error = new Error("User already exists");
      next(error)
    }

    const user = await User.create({
      name,
      email,
      password,
    })

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });

  } catch (error) {
    console.log(error.message);
    const err = new Error("internal server error")
    next(err)
  }
}
);

// obtener informacion del perfil
userRouter.get(
  "/profile",
  protectedUser, async (req, res, next) => {
    try {
      const user = req.user

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
        const error = new Error("user not found");
        next(error)
      }

    } catch (error) {
      console.log(error.message)
      const err = new Error("internal server error")
      next(err)
    }

  }
);

// UPDATE PROFILE
userRouter.put(
  "/profile",
  protectedUser, async (req, res) => {
    const user = await User.findById(req.user._id);

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
      throw new Error("User not found");
    }
  }
);

// obtener todos los usuario pero solo el usuario con rol de admin
userRouter.get(
  "/",
  protectedUser,
  admin,
  async (req, res) => {
    const users = await User.find({});
    res.json(users);
  }
);

export default userRouter;

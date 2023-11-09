import jwt from "jsonwebtoken";
import User from "../Models/UserModel.js";
import Customer from "../Models/CustomerModel.js";

// middleware que me permite verificar que el usuario este logueado
export const protectedUser = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const user = await User.findById(decoded.id).select("-password");

      if (!user) throw Error("User not found but token valid");

      req.user = user;
      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      console.log(error.message);
      const err = new Error("Not authorized, token failed");
      next(err);
    }
  }
  if (!token) {
    res.status(401);
    const error = new Error("Not authorized, no token");
    next(error);
  }
};

// middleware que me permite verificar que el usuario es admin
export const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401);
    const error = new Error("Solo personal Autorizado");
    next(error);
  }
};

// middleware que me permite verificar que el cliente este logueado
export const protectedCustomer = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const customer = await Customer.findById(decoded.id).select("-password");

      if (!customer) throw Error("Customer not found but token valid");

      req.user = customer;
      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      console.log(error.message);
      const err = new Error("Not authorized, token failed");
      next(err);
    }
  }
  if (!token) {
    res.status(401);
    const error = new Error("Not authorized, no token");
    next(error);
  }
};

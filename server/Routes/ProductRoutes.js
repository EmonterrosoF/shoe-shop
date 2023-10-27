import { Router } from "express";
import Product from "./../Models/ProductModel.js";
import {
  admin,
  protectedCustomer,
  protectedUser,
} from "../Middleware/AuthMiddleware.js";
import { ValidateData } from "../Middleware/validationDataMiddleware.js";
import {
  createProductSchema,
  paramsProductSchema,
  queryProductSchema,
  reviewProductSchema,
  updateProductSchema,
} from "../validations/productSchemaValidation.js";

const router = Router();

// obtiene todos los productos o obtiene productos segun la query por nombre
// adicional con paginacion
router.get(
  "/",
  ValidateData({ schema: queryProductSchema, type: "query" }),
  async (req, res) => {
    try {
      const pageSize = 5;
      const page = Number(req.query.pageNumber);
      const keyword = req.query.keyword
        ? {
            name: {
              $regex: req.query.keyword,
              $options: "i",
            },
          }
        : {};
      const count = await Product.countDocuments({ ...keyword });
      const products = await Product.find({ ...keyword })
        .limit(pageSize)
        .skip(pageSize * (page - 1))
        .sort({ _id: -1 });
      res.json({ products, page, pages: Math.ceil(count / pageSize) });
    } catch (error) {
      console.log(error.message);
      const err = new Error("internal server error");
      next(err);
    }
  }
);

// obtiene todos los productos sin busqueda y sin paginacion
// pero este endpoint solo puede ser usado por usuarios logueados
router.get("/all", protectedUser, async (req, res, next) => {
  try {
    const products = await Product.find({}).sort({ _id: -1 });
    res.json(products);
  } catch (error) {
    console.log(error.message);
    const err = new Error("internal server error");
    next(err);
  }
});

// obtiene un unico producto
router.get(
  "/:id",
  ValidateData({ schema: paramsProductSchema, type: "params" }),
  async (req, res, next) => {
    try {
      const product = await Product.findById(req.params.id);
      if (product) {
        res.json(product);
      } else {
        res.status(404);
        const error = new Error("Product not Found");
        next(error);
      }
    } catch (error) {
      console.log(error.message);
      const err = new Error("internal server error");
      next(err);
    }
  }
);

// recibe las valoraciones de un cliente a un producto
router.post(
  "/:id/review",
  ValidateData({ schema: paramsProductSchema, type: "params" }),
  ValidateData({ schema: reviewProductSchema }),
  protectedCustomer,
  async (req, res, next) => {
    const { rating, comment } = req.body;
    try {
      const product = await Product.findById(req.params.id);

      if (product) {
        const alreadyReviewed = product.reviews.find(
          (r) => r.user.toString() === req.user._id.toString()
        );
        if (alreadyReviewed) {
          res.status(400);
          const error = new Error("Product already Reviewed");
          next(error);
          return;
        }
        const review = {
          name: req.user.name,
          rating,
          comment,
          user: req.user._id,
        };

        product.reviews.push(review);
        product.numReviews = product.reviews.length;
        product.rating =
          product.reviews.reduce((acc, item) => item.rating + acc, 0) /
          product.reviews.length;

        await product.save();
        res.status(201).json({ message: "Reviewed Added" });
      } else {
        res.status(404);
        const error = new Error("Product not Found");
        next(error);
      }
    } catch (error) {
      console.log(error.message);
      const err = new Error("internal server error");
      next(err);
    }
  }
);

// eliminar un producto
router.delete(
  "/:id",
  ValidateData({ schema: paramsProductSchema, type: "params" }),
  protectedUser,
  async (req, res, next) => {
    try {
      const product = await Product.findById(req.params.id);
      if (product) {
        await product.remove();
        res.json({ message: "Product deleted" });
      } else {
        res.status(404);
        const error = new Error("Product not Found");
        next(error);
      }
    } catch (error) {
      console.log(error.message);
      const err = new Error("internal server error");
      next(err);
    }
  }
);

// crear productos pero solo usuarios permitidos
router.post(
  "/",
  ValidateData({ schema: createProductSchema }),
  protectedUser,
  async (req, res, next) => {
    const { name, price, description, image, countInStock } = req.body;
    try {
      const productExist = await Product.findOne({ name });
      if (productExist) {
        res.status(400);
        const error = new Error("Product name already exist");
        next(error);
      } else {
        const product = new Product({
          name,
          price,
          description,
          image,
          countInStock,
        });
        if (product) {
          const createdproduct = await product.save();
          res.status(201).json(createdproduct);
        } else {
          res.status(400);
          const error = new Error("Invalid product data");
          next(error);
        }
      }
    } catch (error) {
      console.log(error.message);
      const err = new Error("internal server error");
      next(err);
    }
  }
);

// actualizar un producto pero solo usuario permitidos
router.put(
  "/:id",
  ValidateData({ schema: paramsProductSchema, type: "params" }),
  ValidateData({ schema: updateProductSchema }),
  protectedUser,
  async (req, res, next) => {
    const { name, price, description, image, countInStock } = req.body;

    try {
      const product = await Product.findById(req.params.id);
      if (product) {
        product.name = name || product.name;
        product.price = price || product.price;
        product.description = description || product.description;
        product.image = image || product.image;
        product.countInStock = countInStock || product.countInStock;

        const updatedProduct = await product.save();
        res.json(updatedProduct);
      } else {
        res.status(404);
        const error = new Error("Product not found");
        next(error);
      }
    } catch (error) {
      console.log(error.message);
      const err = new Error("internal server error");
      next(err);
    }
  }
);

export default router;

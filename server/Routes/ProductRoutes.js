import fs from "node:fs";
import { Router } from "express";
import Product from "./../Models/ProductModel.js";
import {
  protectedCustomer,
  protectedUser,
} from "../Middleware/AuthMiddleware.js";
import { ValidateData } from "../Middleware/validationDataMiddleware.js";
import {
  createProductSchema,
  fileProductSchema,
  paramsProductSchema,
  queryProductSchema,
  reviewProductSchema,
  updateProductSchema,
} from "../validations/productSchemaValidation.js";
import { handlerFile } from "../Middleware/handlerFilesMiddleware.js";

import { v2 as cloudinary } from "cloudinary";

const router = Router();

// obtiene todos los productos o obtiene productos segun la query por nombre
// adicional con paginacion
router.get(
  "/",
  ValidateData({ schema: queryProductSchema, type: "query" }),
  async (req, res) => {
    try {
      const pageSize = 10;
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
        .sort({ _id: -1 })
        .populate("category", "id name");
      res.json({ products, page, pages: Math.ceil(count / pageSize) });
    } catch (error) {
      console.log(error.message);
      const err = new Error("Error interno del servidor");
      next(err);
    }
  }
);

// obtiene todos los productos sin busqueda y sin paginacion
// pero este endpoint solo puede ser usado por usuarios logueados
router.get("/all", protectedUser, async (req, res, next) => {
  try {
    const products = await Product.find({})
      .sort({ _id: -1 })
      .populate("category", "id name");
    res.json(products);
  } catch (error) {
    console.log(error.message);
    const err = new Error("Error interno del servidor");
    next(err);
  }
});

// obtiene un unico producto pero solo usuarios permitidos
router.get(
  "/edit/:id",
  ValidateData({ schema: paramsProductSchema, type: "params" }),
  protectedUser,
  async (req, res, next) => {
    try {
      const product = await Product.findById(req.params.id);
      if (product) {
        res.json(product);
      } else {
        res.status(404);
        const error = new Error("Producto no encontrado");
        next(error);
      }
    } catch (error) {
      console.log(error.message);
      const err = new Error("Error interno del servidor");
      next(err);
    }
  }
);

// obtiene un unico producto
router.get(
  "/:id",
  ValidateData({ schema: paramsProductSchema, type: "params" }),
  async (req, res, next) => {
    try {
      const product = await Product.findById(req.params.id).populate(
        "category",
        "id name"
      );
      if (product) {
        res.json(product);
      } else {
        res.status(404);
        const error = new Error("Producto no encontrado");
        next(error);
      }
    } catch (error) {
      console.log(error.message);
      const err = new Error("Error interno del servidor");
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
          const error = new Error("Producto ya valorado");
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
        res.status(201).json({ message: "Valoracion agregada" });
      } else {
        res.status(404);
        const error = new Error("Producto no encontrado");
        next(error);
      }
    } catch (error) {
      console.log(error.message);
      const err = new Error("Error interno del servidor");
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
        res.json({ message: "Producto Eliminado" });
      } else {
        res.status(404);
        const error = new Error("Producto no encontrado");
        next(error);
      }
    } catch (error) {
      console.log(error.message);
      const err = new Error("Error interno del servidor");
      next(err);
    }
  }
);

// crear productos pero solo usuarios permitidos
router.post(
  "/",
  handlerFile,
  ValidateData({ schema: fileProductSchema, type: "file" }),
  ValidateData({ schema: createProductSchema }),
  protectedUser,
  async (req, res, next) => {
    const { name, price, description, countInStock, category } = req.body;

    const image = req.file;
    try {
      const productExist = await Product.findOne({ name });
      if (productExist) {
        res.status(400);
        const error = new Error("El nombre del producto ya existe");
        next(error);
      } else {
        const respImage = await new Promise((resolve, reject) => {
          cloudinary.uploader
            .upload_stream({}, (error, result) => {
              if (error) {
                reject(error);
              }
              resolve(result);
            })
            .end(image.buffer);
        });
        const product = new Product({
          name,
          price,
          description,
          image: respImage.secure_url,
          countInStock: countInStock,
          category,
        });
        if (product) {
          const createdproduct = await product.save();
          res.status(201).json(createdproduct);
        } else {
          res.status(400);
          const error = new Error("Datos del producto invalidos");
          next(error);
        }
      }
    } catch (error) {
      console.log(error);
      const err = new Error("Error interno del servidor");
      next(err);
    }
  }
);

// actualizar un producto pero solo usuario permitidos
router.put(
  "/:id",
  handlerFile,
  ValidateData({ schema: paramsProductSchema, type: "params" }),
  ValidateData({ schema: updateProductSchema }),
  protectedUser,
  async (req, res, next) => {
    const { name, price, description, countInStock, category } = req.body;

    const image = req.file;

    try {
      const product = await Product.findById(req.params.id);
      if (product) {
        product.name = name || product.name;
        product.price = price || product.price;
        product.description = description || product.description;

        if (image) {
          const respImage = await new Promise((resolve, reject) => {
            cloudinary.uploader
              .upload_stream({}, (error, result) => {
                if (error) {
                  reject(error);
                }
                resolve(result);
              })
              .end(image.buffer);
          });
          product.image = respImage.secure_url;
        }

        product.countInStock = countInStock || product.countInStock;
        product.category = category || product.category;

        const updatedProduct = await product.save();
        res.json(updatedProduct);
      } else {
        res.status(404);
        const error = new Error("Producto no encontrado");
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

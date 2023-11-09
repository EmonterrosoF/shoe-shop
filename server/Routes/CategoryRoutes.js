import fs from "node:fs";
import { Router } from "express";
import Category from "./../Models/CategoryModel.js";
import { protectedUser } from "../Middleware/AuthMiddleware.js";
import { ValidateData } from "../Middleware/validationDataMiddleware.js";
import {
  fileProductSchema,
  paramsProductSchema,
} from "../validations/productSchemaValidation.js";
import { handlerFile } from "../Middleware/handlerFilesMiddleware.js";

import { v2 as cloudinary } from "cloudinary";
import {
  createCategorySchema,
  updateCategorySchema,
} from "../validations/categorySchemaValidation.js";

import Product from "../Models/ProductModel.js";

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const categories = await Category.find({}).sort({ _id: -1 });
    res.json(categories);
  } catch (error) {
    console.log(error.message);
    const err = new Error("Error interno del servidor");
    next(err);
  }
});

// obtiene todos los categorias sin busqueda y sin paginacion
// pero este endpoint solo puede ser usado por usuarios logueados
router.get("/all", protectedUser, async (req, res, next) => {
  try {
    const categories = await Category.find({}).sort({ _id: -1 });
    res.json(categories);
  } catch (error) {
    console.log(error.message);
    const err = new Error("Error interno del servidor");
    next(err);
  }
});

// obtiene un unica categoria
router.get(
  "/:id",
  protectedUser,
  ValidateData({ schema: paramsProductSchema, type: "params" }),
  async (req, res, next) => {
    try {
      const category = await Category.findById(req.params.id);
      if (category) {
        res.json(category);
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

// obtiene productos por categoria
router.get(
  "/product/:id",
  ValidateData({ schema: paramsProductSchema, type: "params" }),
  async (req, res, next) => {
    try {
      const pageSize = 10;
      const page = Number(req.query.pageNumber);
      const count = await Product.countDocuments({ category: req.params.id });

      const products = await Product.find({ category: req.params.id })
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

// eliminar una categoria
router.delete(
  "/:id",
  ValidateData({ schema: paramsProductSchema, type: "params" }),
  protectedUser,
  async (req, res, next) => {
    try {
      const products = await Product.find({ category: req.params.id });

      if (products.length > 0) {
        res.status(400);
        const error = new Error("Error La categoria tiene productos asociados");
        return next(error);
      }

      const category = await Category.findById(req.params.id);
      if (category) {
        await category.remove();
        res.json({ message: "Categoria Eliminada" });
      } else {
        res.status(404);
        const error = new Error("Categoria no encontrada");
        next(error);
      }
    } catch (error) {
      console.log(error.message);
      const err = new Error("Error interno del servidor");
      next(err);
    }
  }
);

// crear categorias pero solo usuarios permitidos
router.post(
  "/",
  handlerFile,
  ValidateData({ schema: fileProductSchema, type: "file" }),
  ValidateData({ schema: createCategorySchema }),
  protectedUser,
  async (req, res, next) => {
    const { name, description } = req.body;

    const image = req.file;
    try {
      const categoryExist = await Category.findOne({ name });
      if (categoryExist) {
        res.status(400);
        const error = new Error("El nombre de la categoria ya existe");
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
        const category = new Category({
          name,
          description,
          image: respImage.secure_url,
        });
        if (category) {
          const createdcategory = await category.save();
          res.status(201).json(createdcategory);
        } else {
          res.status(400);
          const error = new Error("Datos de la categoria invalidos");
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

// actualizar una categoria pero solo usuario permitidos
router.put(
  "/:id",
  handlerFile,
  ValidateData({ schema: paramsProductSchema, type: "params" }),
  ValidateData({ schema: updateCategorySchema }),
  protectedUser,
  async (req, res, next) => {
    const { name, description } = req.body;

    const image = req.file;

    try {
      const category = await Category.findById(req.params.id);
      if (category) {
        category.name = name || category.name;
        category.description = description || category.description;

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
          category.image = respImage.secure_url;
        }

        const updatedCategory = await category.save();
        res.json(updatedCategory);
      } else {
        res.status(404);
        const error = new Error("Categoria no encontrada");
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

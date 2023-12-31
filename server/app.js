import path from "node:path";

import express from "express";

import firstBootRoute from "./Routes/FirstBootRoutes.js";
import productRoute from "./Routes/ProductRoutes.js";
import { errorHandler, notFound } from "./Middleware/Errors.js";
import userRouter from "./Routes/UserRoutes.js";
import orderRouter from "./Routes/orderRoutes.js";
import customerRouter from "./Routes/CustomerRoutes.js";
import categoryRoute from "./Routes/CategoryRoutes.js";

import cors from "cors";

import { PAYPAL_CLIENT_ID } from "./config.js";

const app = express();

app.use(express.json());

app.use(cors());

//archivos estaticos
app.use(express.static(path.join(process.cwd(), "public")));

// API

// ruta que nos sirve para agregar usuario admin por defecto
// cuando no exista ninguno
app.use("/api/default", firstBootRoute);

// ruta para los categorias
app.use("/api/categories", categoryRoute);

// ruta para los productos
app.use("/api/products", productRoute);

// ruta para los usuarios
app.use("/api/users", userRouter);

// ruta para los clientes
app.use("/api/customers", customerRouter);

// ruta para las ordenes de los productos
app.use("/api/orders", orderRouter);

// ruta que me retorna el client id de paypal
app.get("/api/config/paypal", (req, res) => {
  res.send(PAYPAL_CLIENT_ID);
});

// para servir el dashboard
app.get("/dashboard/*", function (req, res) {
  res.sendFile(path.join(process.cwd(), "public", "dashboard", "index.html"));
});

// para servir la tienda virtual
app.get("/*", function (req, res) {
  res.sendFile(path.join(process.cwd(), "public", "index.html"));
});

// manejador de errores
app.use(notFound);
app.use(errorHandler);

export default app;

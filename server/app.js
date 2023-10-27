import express from "express";

import firstBootRoute from "./Routes/FirstBootRoutes.js";
import productRoute from "./Routes/ProductRoutes.js";
import { errorHandler, notFound } from "./Middleware/Errors.js";
import userRouter from "./Routes/UserRoutes.js";
import orderRouter from "./Routes/orderRoutes.js";
import customerRouter from "./Routes/CustomerRoutes.js";
import cors from "cors";

import { PAYPAL_CLIENT_ID } from "./config.js";

const app = express();

app.use(express.json());

app.use(cors());

// API

// ruta que nos sirve para agregar usuario admin por defecto
// cuando no exista ninguno
app.use("/api/default", firstBootRoute);

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
  console.log(PAYPAL_CLIENT_ID);
  res.send(PAYPAL_CLIENT_ID);
});

// manejador de errores
app.use(notFound);
app.use(errorHandler);

export default app;

import express from "express";

import firstBootRoute from "./Routes/FirstBoot.js";
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

app.use("/api/users", userRouter);
app.use("/api/customers", customerRouter)
app.use("/api/orders", orderRouter);
app.get("/api/config/paypal", (req, res) => {
  console.log(PAYPAL_CLIENT_ID);
  res.send(PAYPAL_CLIENT_ID);
});

// ERROR HANDLER
app.use(notFound);
app.use(errorHandler);

export default app;

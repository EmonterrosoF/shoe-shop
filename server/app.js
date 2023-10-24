import express from "express";

import firstBootRoute from "./Routes/FirstBoot.js";
import productRoute from "./Routes/ProductRoutes.js";
import { errorHandler, notFound } from "./Middleware/Errors.js";
import userRouter from "./Routes/UserRoutes.js";
import orderRouter from "./Routes/orderRoutes.js";
import cors from "cors";

import { PAYPAL_CLIENT_ID } from "./config.js";

const app = express();

app.use(express.json());

app.use(cors());

// API
app.use("/api/default", firstBootRoute);

app.use("/api/products", productRoute);
app.use("/api/users", userRouter);
app.use("/api/orders", orderRouter);
app.get("/api/config/paypal", (req, res) => {
  console.log(PAYPAL_CLIENT_ID);
  res.send(PAYPAL_CLIENT_ID);
});

// ERROR HANDLER
app.use(notFound);
app.use(errorHandler);

export default app;

import dotenv from "dotenv";

dotenv.config();

export const PORT = process.env.PORT ?? 1000;

export const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;

export const NODE_ENV = process.env.NODE_ENV;

export const MONGO_URL = process.env.MONGO_URL;

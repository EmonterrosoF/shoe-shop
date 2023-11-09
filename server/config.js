import dotenv from "dotenv";

dotenv.config();

//PUERTO
export const PORT = process.env.PORT ?? 1000;

// PAYPAL
export const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;

// NODE
export const NODE_ENV = process.env.NODE_ENV;

//MONGO
export const MONGO_URL = process.env.MONGO_URL;

//CLOUDINARY
export const CLOUD_NAME = process.env.CLOUD_NAME;
export const API_KEY = process.env.API_KEY;
export const API_SECRET = process.env.API_SECRET;

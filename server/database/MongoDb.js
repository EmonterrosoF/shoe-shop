import mongoose from "mongoose";
import { MONGO_URL } from "../config.js";

const connectDatabase = async () => {
  try {
    const conn = await mongoose.connect(MONGO_URL, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });

    console.log(`MongoDB Connected`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

mongoose.set("strictQuery", true);

export default connectDatabase;

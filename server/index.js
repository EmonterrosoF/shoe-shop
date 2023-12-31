import connectDatabase from "./database/MongoDb.js";

import { PORT } from "./config.js";

import app from "./app.js";
import "./utils/cloudinary.js";

connectDatabase();

app.listen(PORT, console.log(`server run in port ${PORT}`));

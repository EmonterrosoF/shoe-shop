import { Router } from "express";
import User from "../Models/UserModel.js";
import bcrypt from "bcryptjs";
import FirstBoot from "../Models/FirstBootModel.js";

const router = Router();

const userAdmin = {
  name: "Admin",
  email: "admin@example.com",
  password: "123456",
  isAdmin: true,
};

router.get("/", async (req, res) => {
  try {
    const isFirstBoot = await FirstBoot.find({});

    if (isFirstBoot.length < 1) {
      const firstBoot = new FirstBoot({ firstBoot: true });
      await firstBoot.save();

      const user = new User(userAdmin);
      await user.save();
    }

    res.send({ message: "exit" });
  } catch (error) {
    console.log(error.message);
    const err = new Error("internal server error");
    next(err);
  }
});

export default router;

import { Router } from "express";
import User from "../Models/UserModel.js";
import bcrypt from "bcryptjs";
import FirstBoot from "../Models/FirstBoot.js";

const router = Router();

const userAdmin = {
  name: "Admin",
  email: "admin@example.com",
  password: bcrypt.hashSync("123456", 10),
  isAdmin: true,
}

router.get("/", async (req, res) => {


  const isFirstBoot = await FirstBoot.find()

  console.log(isFirstBoot)

  if (isFirstBoot.lenght < 0) {
    const user = new User(userAdmin)
    await user.save()
  }

  res.send({ message: "exit" });
})


export default router;

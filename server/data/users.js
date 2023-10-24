import bcrypt from "bcryptjs";

const user = {
  name: "Admin",
  email: "admin@example.com",
  password: bcrypt.hashSync("123456", 10),
  isAdmin: true,
}


export default user;

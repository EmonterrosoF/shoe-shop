import jwt from "jsonwebtoken";

// utilidad para generar el token para mantener la sesion del usuario o cliente
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

export default generateToken;

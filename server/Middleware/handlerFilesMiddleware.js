import multer from "multer";

const storage = multer.memoryStorage();
const fileFilter = (req, file, cb) => {
  if (["image/jpg", "image/jpeg", "image/png"].includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Tipo de archivo invalido: " + file.mimetype));
  }
};

export const handlerFile = multer({
  storage,
  limits: { fileSize: 1024 * 1024 * 5, files: 1 },
  fileFilter,
}).single("image");

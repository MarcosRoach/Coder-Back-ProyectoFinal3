import { fileURLToPath } from "url";
import { dirname } from "path";

//Carpetas estaticas public
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
export default __dirname;

//Configurar Multer
import multer from "multer";
const storage = multer.diskStorage({
  //Carpeta donde se van a guardar los archivos - destination: "public/img",
  destination: function (req, file, cb) {
    cb(null, __dirname + "/public/img");
  },
  //Nombre del archivo - Originalname: nombre original del archivo
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

//importar bcrypt para encriptar la contraseña
import bcrypt from "bcrypt";

//funcion para encriptar la contraseña
export const createHash = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

//funcion para comparar la contraseña
export const isValidPassword = async (userPassword, passwordHash) => {
  return await bcrypt.compare(userPassword, passwordHash);
};

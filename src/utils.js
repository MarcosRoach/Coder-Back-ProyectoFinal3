import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default __dirname;

//importar bcrypt
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

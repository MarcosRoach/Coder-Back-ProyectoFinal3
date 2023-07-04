import mongoose from "mongoose";

//Iniciar Coleccion de User
const usersCollection = "users";

const usersSchema = new mongoose.Schema({
  first_name: String,
  last_name: String,
  email: String,
  age: Number,
  password: String,
  role: String,
});

//Exportar modelo
export const usersModel = mongoose.model(usersCollection, usersSchema);

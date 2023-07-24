import mongoose from "mongoose";

//Iniciar Coleccion de User
const usersCollection = "users";

const usersSchema = new mongoose.Schema({
  first_name: String,
  last_name: String,
  email: String,
  age: Number,
  role: String,
  cartID: { type: mongoose.Schema.Types.ObjectId, ref: "carts" },
  password: String,
});

//Exportar modelo
export const usersModel = mongoose.model(usersCollection, usersSchema);

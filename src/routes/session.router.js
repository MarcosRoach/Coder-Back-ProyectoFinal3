import { Router } from "express";
import { usersModel } from "../daos/mogodb/models/users.model.js";

const router = Router();

// //Post register
router.post("/register", async (req, res) => {
  try {
    const { first_name, last_name, email, age, password } = req.body;
    //Buscar usuario
    const exist = await usersModel.findOne({ email });

    //Validar si el usuario existe
    if (exist) {
      return res.status(400).send({ message: "El usuario ya existe" });
    }

    //Crear usuario
    const user = await usersModel.create({
      first_name,
      last_name,
      email,
      age,
      password,
      role: "user",
    });

    //Enviar respuesta
    res.send({ status: "success", message: "Usuario creado con exito" });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

//Post login
router.post("/login", async (req, res) => {
  let user;
  try {
    const { email, password } = req.body;
    //email a minusculas
    email.toLowerCase();
    //password a string y minusculas
    password.toString().toLowerCase();

    let user;

    //Verificar si es admin
    if (email === "adminCoder@coder.com" && password === "123") {
      user = {
        first_name: "coder",
        last_name: "House",
        email: "adminCoder@coder.com",
        age: 0,
        role: "admin",
      };
    } else {
      user = await usersModel.findOne({ email: email });

      //Validar si el usuario existe
      if (!user) {
        return res.status(400).send({ message: "El usuario es incorrecto" });
        //Redireccionar
      }

      //Validar si la contraseña es correcta
      if (user.password !== password) {
        return res.status(400).send({ message: "Contraseña incorrecta" });
      }
    }

    //Enviar respuesta
    req.session.user = {
      name: user.first_name + user.last_name,
      email: user.email,
      age: user.age,
      role: user.role,
    };
    res.send({
      status: "success",
      message: "Usuario logueado con exito: " + req.session.user.name,
    });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

//Obtener datos de session
router.get("/", (req, res) => {
  //Validar si hay usuario logueado
  if (req.session.user) {
    res.send(req.session.user);
  } else {
    //enviar respuesta de error
    res.status(401).send({ message: "No hay usuario logueado" });
  }
});

//Cerrar session
router.get("/logout", async (req, res) => {
  try {
    // Destruir sesión
    req.session.destroy();
    res.send("Sesión cerrada");
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

export default router;

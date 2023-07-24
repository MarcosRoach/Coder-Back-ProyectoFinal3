import { Router } from "express";
import { usersModel } from "../daos/mogodb/models/users.model.js";
import { cartsModel } from "../daos/mogodb/models/cart.model.js";
import { createHash } from "../utils.js";
import { isValidPassword } from "../utils.js";
import passport from "passport";

const router = Router();

//Post register
router.post("/register", async (req, res) => {
  try {
    const { first_name, last_name, email, age, password } = req.body;
    //Buscar usuario
    const exist = await usersModel.findOne({ email });

    //Validar si el usuario existe
    if (exist) {
      return res.status(400).send({ message: "El usuario ya existe" });
    }

    // Crear carrito de compras para el usuario
    const cart = await cartsModel.create({ products: [], quantity: 0 });
    //Crear usuario
    const user = await usersModel.create({
      first_name,
      last_name,
      email,
      age,
      role: "user",
      cartID: cart._id,
      password: await createHash(password),
    });

    //Enviar respuesta
    res.send({ status: "success", message: "Usuario creado con exito" });
  } catch (error) {
    res.status(500).send({ message: "Error de Servidor" });
  }
});

router.get("/failregister", (req, res) => {
  res.status(400).send({ status: "failed", message: "Usuario ya existente" });
});

// Login local
router.post("/login", passport.authenticate("login"), async (req, res) => {
  try {
    // Si el usuario no existe o la contraseña es incorrecta
    if (!req.user) {
      return res
        .status(400)
        .send({ message: "Usuario o contraseña incorrecta" });
    }

    // Crear sesión
    req.session.user = {
      name: req.user.first_name + " " + req.user.last_name,
      email: req.user.email,
      age: req.user.age,
      role: req.user.role,
    };

    // Enviar respuesta
    res.send({
      status: "success",
      message: "Usuario logueado con éxito: " + req.session.user.name,
    });
  } catch (error) {
    // Si hay un error en el servidor
    return res.status(500).send({ error: "Error en el servidor" });
  }
});

//Login con github
router.get(
  "/github",
  passport.authenticate("github", { scope: "user:email" }),
  (req, res) => {}
);

//Callback de github
router.get(
  "/githubcallback",
  passport.authenticate("github", {
    failureRedirect: "/login",
  }),
  async (req, res) => {
    //Crear session
    req.session.user = {
      name: req.user.first_name + req.user.last_name,
      email: req.user.email,
      age: req.user.age,
      role: req.user.role,
    };
    //Enviar respuesta
    res.redirect("/products");
  }
);

//Post resetPass
router.post("/resetPass", async (req, res) => {
  try {
    //Obtener datos body
    const { email, password } = req.body;

    //Buscar usuario
    const user = await usersModel.findOne({ email: email });

    //Validar si el usuario existe
    if (!user) {
      return res.status(400).send({ message: "El usuario no existe" });
    }
    console.log(user);

    //Validar que la contraseña no sea la misma que la anterior
    if (await isValidPassword(password, user.password)) {
      return res
        .status(400)
        .send({ message: "La contraseña no puede ser la misma" });
    }

    //Actualizar contraseña con hash
    user.password = await createHash(password);

    //Guardar usuario
    await user.save();

    //Enviar respuesta
    return res.status(200).send({ message: "Contraseña cambiada con exito" });
  } catch {
    //Error de servidor
    res.status(500).send({ message: "Error de servidor" });
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

//Current user
router.get("/current", async (req, res) => {
  try {
    //Buscar usuario en cookie
    const user = req.session.user;

    //Validar si hay usuario
    if (!user) {
      return res.status(401).send({ message: "No hay usuario logueado" });
    }
    //Retornar usuario
    res.send(user);
  } catch (error) {
    //Error de servidor
    res.status(500).send({ error: error.message });
  }
});

export default router;

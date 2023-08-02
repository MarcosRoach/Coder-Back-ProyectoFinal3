import passport from "passport";
import githubStrategy from "passport-github2";
import LocalStrategy from "passport-local";
import { usersModel } from "../daos/mogodb/models/users.model.js";
import { cartsModel } from "../daos/mogodb/models/cart.model.js";
import { createHash } from "../utils.js";
import { isValidPassword } from "../utils.js";

export const initializePassport = () => {
  //github strategy
  passport.use(
    "github",
    new githubStrategy(
      {
        clientID: "Iv1.d79b7de2cfed2492",
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: "http://localhost:8080/api/sessions/githubcallback",
      },
      async (accessToken, refreshToken, profile, done) => {
        //Buscar el usuario en la base de datos
        let user = await usersModel.findOne({ email: profile._json.email });

        //Si existe el usuario, retornar el usuario
        if (user) {
          return done(null, user);
        } else {
          //Si no existe el usuario, crearlo

          // Crear carrito de compras para el usuario
          const cart = await cartsModel.create({ products: [], quantity: 0 });

          user = await usersModel.create({
            first_name: profile._json.name,
            last_name: "",
            email: profile._json.email,
            age: 20,
            cartID: cart._id,
            password: "123",
            role: "user",
          });
          //Retornar el usuario
          return done(null, user);
        }
      }
    )
  );

  //Login Strategy
  passport.use(
    "login",
    new LocalStrategy(
      {
        usernameField: "email",
      },
      async (email, password, done) => {
        try {
          //pasar el email a minusculas
          email.toLowerCase();
          //pasar password a string y minusculas
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
            //Buscar el usuario en la base de datos
            user = await usersModel.findOne({ email: email });
          }

          //Validar si el usuario existe
          if (!user) {
            return done(null, false);
          }

          //Validar si la contraseña es correcta
          if (!(await isValidPassword(password, user.password))) {
            return done(null, false);
          }

          //Retornar el usuario
          console.log("Usuario encontrado");
          if (user) {
            return done(null, user);
          }
        } catch (error) {
          //Enviar error
          return done(error);
        }
      }
    )
  );

  //Register Strategy
  passport.use(
    "register",
    new LocalStrategy(
      { passReqToCallback: true, usernameField: "email" },
      async (req, username, password, done) => {
        try {
          // Obtener los datos del cuerpo de la solicitud utilizando destructuring
          const { first_name, last_name, email, age } = req.body;

          console.log("Datos recibidos para registro:");
          console.log(req.body);

          // Verificar si el usuario ya existe en la base de datos
          let user = await usersModel.findOne({ email: email });

          if (user) {
            console.log("El usuario ya existe.");
            return done(null, false);
          }

          // Crear un carrito de compras para el usuario
          const cart = await cartsModel.create({ products: [], quantity: 0 });
          console.log("Carrito de compras creado. ID:", cart._id);

          // Crear el objeto newUser utilizando el operador de reposo (spread operator)
          const newUser = {
            first_name,
            last_name,
            email,
            age,
            role: "user",
            cartID: cart._id,
            password: await createHash(password),
          };

          console.log("Nuevo usuario creado:");
          console.log(newUser);

          // Guardar el nuevo usuario en la base de datos
          let result = await usersModel.create(newUser);
          console.log("Usuario registrado con éxito.");
          console.log(result);

          if (result) {
            return done(null, result);
          }
        } catch (error) {
          console.error("Error al crear usuario:", error);
          return done(error);
        }
      }
    )
  );

  //Reset password strategy
  passport.use(
    "resetPass",
    new LocalStrategy(
      {
        usernameField: "email", // Campo utilizado para el nombre de usuario
      },
      async (email, password, done) => {
        console.log("Datos recibidos para resetear contraseña:");
        console.log(email, password);
        try {
          //Buscar usuario
          const user = await usersModel.findOne({ email: email });

          // Si el usuario no existe, retornamos un error
          if (!user) {
            console.log("Usuario no encontrado");
            return done(null, false, { message: "Usuario no encontrado" });
          }

          //Validar que la contraseña no sea la misma que la anterior
          if (await isValidPassword(password, user.password)) {
            return done(null, false, {
              message: "La contraseña no puede ser la misma",
            });
          }

          //Encriptar la nueva contraseña
          const newPassword = await createHash(password);
          user.password = newPassword;

          //Guardar usuario
          await user.save();
          // Finalmente, retornamos el usuario con la contraseña restablecida
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );
};

//Serializar el usuario
passport.serializeUser((user, done) => {
  done(null, user._id);
});

//Deserializar el usuario
passport.deserializeUser(async (id, done) => {
  const user = await usersModel.findById(id);
  done(null, user);
});

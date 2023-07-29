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
        clientSecret: "ee9e20c8af5febe61d5e940aca4533ed89bc9632",
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
          return done(null, user);
        } catch (error) {
          //Enviar error
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

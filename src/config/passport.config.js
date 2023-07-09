import passport from "passport";
import githubStrategy from "passport-github2";
import { usersModel } from "../daos/mogodb/models/users.model.js";

export const initializePassport = () => {
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
          user = await usersModel.create({
            first_name: profile._json.name,
            last_name: "",
            email: profile._json.email,
            age: 20,
            password: "123",
            role: "user",
          });
          //Retornar el usuario
          return done(null, user);
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

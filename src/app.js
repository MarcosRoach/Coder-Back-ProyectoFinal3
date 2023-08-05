import express from "express";
import handlebars from "express-handlebars";

import __dirname from "./utils.js";

import db from "./daos/db/mongo.js";
import session from "express-session";
import MongoStore from "connect-mongo";
import { initializePassport } from "./config/passport.config.js";
import passport from "passport";
import cookieParser from "cookie-parser";

import productRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import viewsRouter from "./routes/views.router.js";
import messagesRouter from "./routes/messages.router.js";
import sessionRouter from "./routes/session.router.js";

import { Server } from "socket.io";

import ProductManager from "./daos/mogodb/class/ProductManager.js";
import CartManager from "./daos/mogodb/class/CartManager.js";

import productController from "./controllers/product.controller.js";

//Dotenv
import dotenv from "dotenv";

//Commander
import { Command } from "commander";
const program = new Command();
program.option("--mode <mode>", "Modo de ejecucion", "dev");
program.parse();
const mode = program.opts().mode;
console.log("Modo de ejecucion: ", mode);
dotenv.config({
  path: mode === "dev" ? ".env.development" : ".env.production",
});

//Inicializar express
const app = express();

//Habilitar Servidor para recibir JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Carpetas estaticas public
app.use(express.static(__dirname + "/public"));

//Configuracion de handlebars
app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

//Levantar el servidor
const expressServer = app.listen(process.env.PORT, () => {
  console.log(`Servidor express corriendo en el puerto ${process.env.PORT}`);
});
//concetar a la base de datos
db();

//session con cookies
app.use(cookieParser(process.env.COOKIE_SECRET));

//session con mongo
app.use(
  session({
    store: new MongoStore({
      mongoUrl:
        "mongodb+srv://roachmarcos:29768344Msr@cluster0.qwzygw8.mongodb.net/ecommerce?retryWrites=true&w=majority",
    }),
    secret: process.env.MONGO_SECRET,
    resave: true,
    saveUninitialized: true,
  })
);

//Inicializar passport
initializePassport();
app.use(passport.initialize());
app.use(passport.session());

//Intancia de productos
let productManager = new ProductManager();

const socketServer = new Server(expressServer);

socketServer.on("connection", async (socket) => {
  console.log("Nuevo cliente conectado " + socket.id);

  //server emite productos al cliente que se conecta
  const products = await productManager.getProducts();
  console.log("Productos enviados: ");
  socket.emit("products", products);

  //server escucha buscar producto filtrado
  socket.on("productsFilter", async (filters) => {
    const filteredProducts = await productController.getProducts(filters);
    socket.emit("productsFilters", filteredProducts);
  });
});

//Middelware para pasar socketServer a los routers
app.use((req, res, next) => {
  req.socketServer = socketServer;
  next();
});

//RUTAS
//Router Views
app.use("/", viewsRouter);

//Router User
app.use("/api/products", productRouter);

//Router Carts
app.use("/api/carts", cartsRouter);

//Router Mensajes
app.use("/api/messages", messagesRouter);

//Router session
app.use("/api/sessions", sessionRouter);

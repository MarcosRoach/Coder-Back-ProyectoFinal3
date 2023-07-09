import express from "express";
import handlebars from "express-handlebars";

import __dirname from "./utils.js";

import db from "./daos/db/mongo.js";
import session from "express-session";
import MongoStore from "connect-mongo";
import { initializePassport } from "./config/passport.config.js";
import passport from "passport";

import productRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import viewsRouter from "./routes/views.routes.js";
import messagesRouter from "./routes/messages.router.js";
import sessionRouter from "./routes/session.router.js";

import { Server } from "socket.io";

import ProductManager from "./daos/filesystem/ProductManager.js";
import CartManager from "./daos/filesystem/CartManager.js";

//Inicializar express
const app = express();

//Middelware para recibir json
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Carpetas estaticas
app.use(express.static(__dirname + "/public"));

//Configuracion de handlebars
app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

//Levantar el servidor
const port = 8080;
const expressServer = app.listen(port, () => {
  console.log(`Servidor express corriendo en el puerto ${port}`);
});

//Inicializar socket.io
const socketServer = new Server(expressServer);

//concetar a la base de datos
db();

//Inicializar passport
initializePassport();

//session con mongo
app.use(
  session({
    store: new MongoStore({
      mongoUrl:
        "mongodb+srv://roachmarcos:29768344Msr@cluster0.qwzygw8.mongodb.net/ecommerce?retryWrites=true&w=majority",
    }),
    secret: "mongoSecret",
    resave: true,
    saveUninitialized: true,
  })
);

//Use passport
app.use(passport.initialize());

//Socket.io connection
socketServer.on("connection", async (socket) => {
  console.log("Nuevo cliente conectado! + " + socket.id);

  //Intancia de productos
  let productManager = new ProductManager();
  //Emitir evento socket.io con los productos
  socket.emit("getProducts", await productManager.getProducts());

  //Agregar producto y renderizar en el cliente el nuevo producto
  socket.on("addProductToCart", async (carritoID, productID) => {
    //Intancia de carrito
    let cartManager = new CartManager();
    await cartManager.addProductToCart(carritoID, productID);
  });
});

//Middelware para pasar socketServer a los routers
app.use((req, res, next) => {
  req.socketServer = socketServer;
  next();
});

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

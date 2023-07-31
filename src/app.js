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

import ProductManager from "./daos/managers/ProductManager.js";
import CartManager from "./daos/managers/CartManager.js";

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
const port = 8080;
const expressServer = app.listen(port, () => {
  console.log(`Servidor express corriendo en el puerto ${port}`);
});

//concetar a la base de datos
db();

//session con cookies
app.use(cookieParser("mongoSecret"));

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
  socket.emit("products", products);

  //server escucha buscar producto filtrado
  socket.on("productsFilter", async (filters) => {
    console.log("Filtros recibidos: ", filters);
    const { limit, page, sort, filtro, filtroVal } = filters;

    const filtersProducts = await productManager.getProducts(
      limit,
      page,
      sort,
      filtro,
      filtroVal
    );
    socket.emit("productsFilters", filtersProducts);
  });
});

//Middelware para pasar socketServer a los routers
app.use((req, res, next) => {
  req.socketServer = socketServer;
  next();
});

//Rutas
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

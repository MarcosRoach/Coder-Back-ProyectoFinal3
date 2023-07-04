import { Router } from "express";
import __dirname from "../utils.js";
import ProductManager from "../daos/filesystem/ProductManager.js";

let productManager = new ProductManager();

const router = Router();

// router.get("/", async (req, res) => {
//   let products = await productManager.getProducts();
//   res.render("home");
// });

//Rutas session
router.get("/", (req, res) => {
  res.render("login");
});

router.get("/register", (req, res) => {
  res.render("register");
});

router.get("/login", (req, res) => {
  res.render("login");
});

//Vista a Productos
router.get("/products", async (req, res) => {
  //page
  let page = req.query.page || 5;
  //Orden
  let sort = req.query.sort || -1;
  //Limite
  let limit = req.query.limit || 6;
  //Filtro
  let filter = req.query.filter || "";
  let filterVal = req.query.filterVal || "";

  try {
    //Obtener productos
    let products = await productManager.getProducts(
      filter,
      filterVal,
      limit,
      sort,
      (page = 3)
    );

    //Usar socket.io
    req.socketServer.socket.emit("getProducts", async (products) => {
      res.render("products", {
        title: "Products",
        products: products,
      });
    });
  } catch (error) {
    res.render("products", {
      title: "Productos",
      products: "No hay productos",
    });
  }
});

//Vista a Carritos
router.get("/cart", (req, res) => {
  res.render("cart");
});

export default router;

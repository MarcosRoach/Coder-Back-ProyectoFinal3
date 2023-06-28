import { Router } from "express";
import __dirname from "../utils.js";
import ProductManager from "../daos/filesystem/ProductManager.js";

let productManager = new ProductManager();

const router = Router();

router.get("/", async (req, res) => {
  let products = await productManager.getProducts();
  res.render("home", {
    title: "Inicio",
    products: products,
  });
});

router.get("/products", async (req, res) => {
  //page
  let page = req.query.page || 1;
  //Orden
  let sort = req.query.sort || -1;
  //Limite
  let limit = req.query.limit || 5;
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
      page
    );

    //Usar socket.io
    req.socketServer.emit("getProducts", async (products) => {
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

export default router;

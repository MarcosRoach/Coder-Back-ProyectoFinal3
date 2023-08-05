import { Router } from "express";
import __dirname from "../utils.js";
import ProductManager from "../daos/mogodb/class/ProductManager.js";

let productManager = new ProductManager();

const router = Router();

//Rutas session
router.get("/", (req, res) => {
  res.render("login");
});

router.get("/login", (req, res) => {
  res.render("login");
});

router.get("/register", (req, res) => {
  res.render("register");
});

router.get("/resetPass", (req, res) => {
  res.render("resetPass");
});

//Vista a Productos
router.get("/products", async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 10;
    const page = Number(req.query.page) || 1;
    const sort = Number(req.query.sort) || 0;
    const filtro = req.query.filtro || "";
    const filtroVal = req.query.filtroVal || "";

    const products = await productManager.getProducts(
      limit,
      page,
      sort,
      filtro,
      filtroVal
    );

    const productsPag = {
      title: "Productos",
      products: products.docs,
      nextPage: products.nextPage,
      prevPage: products.prevPage,
    };

    //Renderizar productos y elementos de paginate
    res.render("products", productsPag);
  } catch (error) {
    res.render("products", {
      title: "Productos",
      products: "No hay productos",
    });
  }
});

//Vista a Productos en tiempo real
router.get("/realtimeproducts", async (req, res) => {
  try {
    let products = await productManager.getProducts();
    res.render("realTimeProducts", products);
  } catch (error) {
    res.status(500).json({ error: "No se pudo obtener los productos" });
  }
});

//Vista a Carritos
router.get("/cart", (req, res) => {
  res.render("cart");
});

//Vista a Current User
router.get("/current", (req, res) => {
  res.render("current");
});

export default router;

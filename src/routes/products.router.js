//Router User
import { Router } from "express";
import createProductController from "../controllers/product.controller.js";
import getProductController from "../controllers/product.controller.js";
import ProductManager from "../daos/mogodb/class/ProductManager.js";

const router = Router();

//Instancia ProductManager
const productManager = new ProductManager();

//Get by id
router.get("/:pid", getProductController.getProduct);

// Post
router.post("/", createProductController.createProducts);

// Put
router.put("/:pid", async (req, res) => {
  //Id
  const pid = req.params.pid;
  //body
  let producto = JSON.stringify(req.body);

  //Respuesta
  res.send(await productManager.updateProduct(pid, producto));
});

// Delete
router.delete("/:pid", async (req, res) => {
  //Id
  const pid = req.params.pid;

  //Respuesta
  res.send(await productManager.deleteProduct(pid));
});

router.get("/", async (req, res) => {
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
  res.send(products);
});

export default router;

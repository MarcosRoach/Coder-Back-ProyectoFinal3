//Router User
import { Router } from "express";
import productController from "../controllers/product.controller.js";
import ProductManager from "../daos/mogodb/class/ProductManager.js";

const router = Router();

//Instancia ProductManager
const productManager = new ProductManager();

//Get by id
router.get("/:pid", productController.getProductById);

// Post
router.post("/", productController.createProducts);

// Put
router.put("/:pid", productController.updateProductById);

// Delete
router.delete("/:pid", productController.deleteProductById);

//Get Products
router.get("/", productController.getProducts);

export default router;

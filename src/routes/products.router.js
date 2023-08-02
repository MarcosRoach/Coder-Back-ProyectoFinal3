//Router User
import { Router } from "express";
import ProductManager from "../daos/mogodb/class/ProductManager.js";

const router = Router();

//Instancia ProductManager
const productManager = new ProductManager();

//Get Productos de bd con limite, pagina, orden, query
// router.get("/", async (req, res) => {
//   const limit = Number(req.query.limit) || 10;
//   const page = Number(req.query.page) || 1;
//   const sort = Number(req.query.sort) || 0;
//   const filtro = req.query.filtro || "";
//   const filtroVal = req.query.filtroVal || "";

//   const products = await productManager.getProducts(
//     limit,
//     page,
//     sort,
//     filtro,
//     filtroVal
//   );
//   res.send(products);
// });

//Get by id
router.get("/:pid", async (req, res) => {
  //Id
  const pid = req.params.pid;

  //Respuesta
  res.send(await productManager.getProductById(pid));
});

// Post
router.post("/", async (req, res) => {
  //Body
  let producto = JSON.stringify(req.body);
  //Agregar producto
  await productManager.addProduct(producto);

  //Limite de productos
  const page = Number(req.query.page) || 1;

  //Obtener productos

  const products = await productManager.getProducts(
    "category",
    "Electrónicos",
    3,
    -1,
    page
  );
  //Enviar productos al todos los clientes
  req.socketServer.emit("getProducts", { ...products });

  //Respuesta
  res.send({ status: "success", message: "Producto agregado" });
});

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

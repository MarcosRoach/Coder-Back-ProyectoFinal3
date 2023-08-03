import createProductService from "../services/product.service.js";

async function createProducts(req, res) {
  try {
    const product = req.body;
    //Controlar campos del producto
    if (
      !product.title ||
      !product.description ||
      !product.code ||
      !product.price ||
      !product.category
    ) {
      return res.status(400).send({ error: "Faltan campos obligatorios" });
    }

    //Si status no esta definido, se setea en true
    if (!product.status) {
      product.status = true;
    }

    //Si stock no esta definido, se setea en 0
    if (!product.stock) {
      product.stock = 0;
    }

    //Agregar producto
    console.log("Producto a agregar controller: ");
    console.log(product);
    const result = await createProductService.createProducts(product);
    res.json(result);
  } catch {
    res.status(500).send({ error: "Error al agregar el producto" + error });
  }
}

async function getProduct(req, res) {
  console.log("getProduct");
  try {
    //Controlar que pid no sea nulo
    if (!req.params.pid) {
      return res.status(400).send({ error: "Falta el id del producto" });
    }

    const pid = req.params.pid;

    res.send(product);
  } catch {
    res.status(500).send({ error: "Error al obtener el producto" + error });
  }
}

export default { createProducts, getProduct };

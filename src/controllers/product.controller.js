import productService from "../services/product.service.js";

//Get Product by id
async function getProductById(req, res) {
  try {
    //Controlar que pid no sea nulo
    if (!req.params.pid) {
      return res.status(400).send({ error: "Falta el id del producto" });
    }

    //Pid del producto
    const pid = req.params.pid;

    //Llama a servicio para obtener producto
    const result = await productService.getProductById(pid);
    res.send(result);
  } catch (error) {
    return res.send(result);
  }
}

//Add Product
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
    const result = await productService.createProducts(product);
    res.json(result);
  } catch {
    res.status(500).send({ error: "Error al agregar el producto" + error });
  }
}

//Update Product by id
async function updateProductById(req, res) {
  try {
    //Controlar que pid no sea nulo
    if (!req.params.pid) {
      return res.status(400).send({ error: "Falta el id del producto" });
    }

    //Pid del producto
    const pid = req.params.pid;
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

    //Llama a servicio para Actualizar producto
    const result = await productService.updateProductById(pid, product);
    res.send(result);
  } catch (error) {
    res
      .status(500)
      .send({ error: "Error al actualizar el producto: " + error });
  }
}

//Delete Product by id
async function deleteProductById(req, res) {
  try {
    //Controlar que pid no sea nulo
    if (!req.params.pid) {
      return res.status(400).send({ error: "Falta el id del producto" });
    }

    //Pid del producto
    const pid = req.params.pid;

    //Llama a servicio para eliminar producto
    const result = await productService.deleteProductById(pid);
    res.send(result);
  } catch (error) {
    res.status(500).send({ error: "Error al eliminar el producto" + error });
  }
}

//Get Products
async function getProducts(filters) {
  console.log("Filters controller:  ");
  console.log(filters);
  try {
    const limit = Number(filters.limit) || 10;
    const page = Number(filters.page) || 1;
    const sort = Number(filters.sort) || 0;
    const filtro = filters.filtro || "";
    const filtroVal = filters.filtroVal || "";

    console.log("page: ", page);

    const result = await productService.getProducts(
      limit,
      page,
      sort,
      filtro,
      filtroVal
    );
    return result;
  } catch (error) {
    return { success: false, error: error };
  }
}

export default {
  createProducts,
  getProductById,
  updateProductById,
  deleteProductById,
  getProducts,
};

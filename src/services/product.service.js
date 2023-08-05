import ProductManager from "../daos/mogodb/class/ProductManager.js";

//Add Product
async function createProducts(product) {
  const productManager = new ProductManager();

  //Verificar si existe el producto
  const findProduct = await productManager.getProductByCode(product.code);
  if (findProduct) {
    return { success: false, message: "El codigo del producto ya existe" };
  }

  //Agregar producto
  console.log("Producto a agregar service: ");
  console.log(product);
  const newProduct = await productManager.addProduct(product);
  return {
    success: true,
    message: "Producto agregado correctamente.",
    product: newProduct,
  };
}

//Get Product by id
async function getProductById(pid) {
  const productManager = new ProductManager();
  try {
    //Llama a Dao para obtener producto
    const result = await productManager.getProductById(pid);
    return result;
  } catch (error) {
    return { success: false, error: error };
  }
}

//Update Product by id
async function updateProductById(pid, product) {
  const productManager = new ProductManager();

  //Verificar si existe el producto
  const findProduct = await this.getProductById(pid);
  if (!findProduct.product) {
    return { success: false, message: "El producto no existe", product: null };
  }

  //Actualizar producto
  const result = await productManager.updateProductById(pid, product);
  return result;
}

//Delete Product by id
async function deleteProductById(pid) {
  const productManager = new ProductManager();

  //Verificar si existe el producto
  const findProduct = await this.getProductById(pid);
  if (!findProduct.product) {
    return { success: false, message: "El producto no existe", product: null };
  }

  //Eliminar producto
  const result = await productManager.deleteProductById(pid);
  return result;
}

//Get Products
async function getProducts(limit, page, sort, filtro, filtroVal) {
  const productManager = new ProductManager();

  let whereOptions = {};

  //Filtro
  if (filtro && filtroVal) {
    whereOptions = { [filtro]: filtroVal };
  }

  //Opciones
  const options = {
    limit,
    page,
    sort: { price: sort },
  };

  //Ordenamiento
  if (sort === 1 || sort === -1) options.sort = { price: sort };

  try {
    const result = await productManager.getProducts(whereOptions, options);
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

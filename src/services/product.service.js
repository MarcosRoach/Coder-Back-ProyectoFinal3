import ProductManager from "../daos/mogodb/class/ProductManager.js";

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

export default { createProducts };

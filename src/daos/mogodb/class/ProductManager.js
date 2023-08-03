import { productsModel } from "../models/products.model.js";

//Clase
class ProductManager {
  //Metodos

  getAllProducts = async () => {
    let products = await productsModel.find().lean();
    return products;
  };

  //Get Product by id
  getProductById = async (pid) => {
    //Obtener producto
    try {
      const product = await productsModel.findById(pid);
      return product;
    } catch (error) {
      return { error: "No Existe el producto" };
    }
  };

  //Get Product by code
  getProductByCode = async (code) => {
    try {
      const product = await productsModel.findOne({ code: code });
      return product;
    } catch (error) {
      return { error: "No Existe el producto" };
    }
  };

  //Add Product
  addProduct = async (product) => {
    //Agregar producto
    try {
      console.log("Producto a agregar DAO: ");
      console.log(product);
      const newProduct = await productsModel.create(product);
      return {
        success: true,
        message: "Producto agregado correctamente.",
        product: newProduct,
      };
    } catch (error) {
      return {
        success: false,
        message: "Error al agregar el producto." + error,
      };
    }
  };

  //Update Product
  updateProduct = async (pid, product) => {
    console.log(pid);
    //Actualizar producto
    try {
      const updateProduct = await productsModel.updateOne(
        { _id: pid },
        { $set: JSON.parse(product) }
      );
      return { success: "Producto actualizado" };
    } catch (error) {
      return { error };
    }
  };

  //Delete Product
  deleteProduct = async (pid) => {
    //Eliminar producto
    try {
      const deleteProduct = await productsModel.deleteOne({ _id: pid });
      return { success: "Producto eliminado" + deleteProduct };
    } catch (error) {
      return { error };
    }
  };

  async getProducts(
    limit = 10,
    page = 1,
    sort = 1,
    filtro = null,
    filtroVal = null
  ) {
    let whereOptions = {};

    // se podría hacer una validación mejor
    if (filtro != "" && filtroVal != "") {
      whereOptions = { [filtro]: filtroVal };
    }

    const options = {
      limit,
      page,
      sort: { price: sort },
    };

    if (sort === 1 || sort === -1) options.sort = { price: sort };

    const result = await productsModel.paginate(whereOptions, options);
    return result;
  }
}

export default ProductManager;

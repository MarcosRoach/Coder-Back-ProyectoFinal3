import { productsModel } from "../models/products.model.js";

//Clase
class ProductManager {
  //METODOS

  //Get Product by id
  getProductById = async (pid) => {
    try {
      const product = await productsModel.findById(pid);

      return {
        success: true,
        message: "Producto Encontrado",
        product: product,
      };
    } catch (error) {
      return {
        success: false,
        message: "No existe el producto",
        product: null,
      };
    }
  };

  getAllProducts = async () => {
    let products = await productsModel.find().lean();
    return products;
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
  updateProductById = async (pid, product) => {
    //Actualizar producto
    try {
      //mongoose updateOne
      const updateProduct = await productsModel.updateOne(
        { _id: pid },
        { $set: product }
      );
      return { success: "Producto actualizado" + updateProduct };
    } catch (error) {
      return { message: "zzzzzzzzzz: " + error };
    }
  };

  //Delete Product
  deleteProductById = async (pid) => {
    //Eliminar producto
    try {
      const deleteProduct = await productsModel.deleteOne({ _id: pid });
      return {
        success: true,
        message: "Producto eliminado correctamente.",
        product: deleteProduct,
      };
    } catch (error) {
      return { error };
    }
  };

  //Get Products
  async getProducts(whereOptions, options) {
    const result = await productsModel.paginate(whereOptions, options);
    return result;
  }
}

export default ProductManager;

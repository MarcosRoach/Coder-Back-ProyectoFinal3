import { productsModel } from "../mogodb/models/products.model.js";

//Clase
class ProductManager {
  //Metodos

  //Get Products de bd
  getProducts = async (filter, filterVal, limit, sort, page) => {
    //Filtro
    console.log("Filtro: " + filter);
    console.log("FiltroVal: " + filterVal);
    console.log("Limite: " + limit);
    console.log("Orden: " + sort);
    console.log("Page: " + page);

    let filterPaginate = {};
    filterPaginate[filter] = filterVal;

    //Obtener productos
    try {
      const products = await productsModel.paginate(filterPaginate, {
        limit: 5,
        sort: { price: -1 },
        page: 1,
        lean: true,
      });
      return products;
    } catch (error) {
      return { error: "No Existen productos" };
    }
  };



  

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
    //pasa a json
    const findProduct = JSON.parse(product);
    //Verificar si existe el producto
    const productExist = await productsModel.findOne({
      code: findProduct.code,
    });

    if (productExist) {
      return { error: "Ya existe el producto" };
    }

    //Agregar producto
    try {
      const newProduct = await productsModel.create(findProduct);
      return { success: "Producto agregado" + JSON.stringify(newProduct) };
    } catch (error) {
      return { error: error };
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
}

export default ProductManager;

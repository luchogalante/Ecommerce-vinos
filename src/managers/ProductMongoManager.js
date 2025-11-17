import ProductModel from "../models/Product.model.js";

export default class ProductMongoManager {

  // Obtener productos con filtros, sort y paginación
  async getProducts(query = {}, options = {}) {
    try {
      const result = await ProductModel.paginate(query, options);
      return result;
    } catch (error) {
      console.error("Error en getProducts:", error);
      throw new Error("No se pudieron obtener los productos");
    }
  }

  // Obtener producto por ID
  async getProductById(id) {
    try {
      const product = await ProductModel.findById(id);
      return product;
    } catch (error) {
      console.error("Error en getProductById:", error);
      throw new Error("No se pudo obtener el producto");
    }
  }

  // Crear producto
  async createProduct(data) {
    try {
      const created = await ProductModel.create(data);
      return created;
    } catch (error) {
      console.error("Error en createProduct:", error);
      throw new Error("No se pudo crear el producto");
    }
  }

  // Actualizar producto por ID
  async updateProduct(id, data) {
    try {
      const updated = await ProductModel.findByIdAndUpdate(id, data, { new: true });
      return updated;
    } catch (error) {
      console.error("Error en updateProduct:", error);
      throw new Error("No se pudo actualizar el producto");
    }
  }

  // Eliminar producto por ID
  async deleteProduct(id) {
    try {
      const deleted = await ProductModel.findByIdAndDelete(id);
      return deleted;
    } catch (error) {
      console.error("Error en deleteProduct:", error);
      throw new Error("No se pudo eliminar el producto");
    }
  }
}

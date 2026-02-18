import ProductMongoManager from "../managers/ProductMongoManager.js";

export default class ProductRepository {

  constructor() {
    this.dao = new ProductMongoManager();
  }

  getProducts(query, options) {
    return this.dao.getProducts(query, options);
  }

  getProductById(id) {
    return this.dao.getProductById(id);
  }

  createProduct(data) {
    return this.dao.createProduct(data);
  }

  updateProduct(id, data) {
    return this.dao.updateProduct(id, data);
  }

  deleteProduct(id) {
    return this.dao.deleteProduct(id);
  }
}

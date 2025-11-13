import fs from "fs/promises";

class ProductManager {
  constructor(path) {
    this.path = path; // ✅ Usar la ruta tal cual llega
  }

  async getProducts() {
    try {
      return JSON.parse(await fs.readFile(this.path, "utf-8"));
    } catch {
      return [];
    }
  }

  async getProductById(id) {
    const products = await this.getProducts();
    return products.find((p) => p.id == id);
  }

  async addProduct(product) {
    const products = await this.getProducts();
    const newProduct = { id: Date.now().toString(), ...product };
    products.push(newProduct);
    await fs.writeFile(this.path, JSON.stringify(products, null, 2));
    return newProduct;
  }

  async updateProduct(id, data) {
    const products = await this.getProducts();
    const index = products.findIndex((p) => p.id == id);
    if (index === -1) return null;
    products[index] = { ...products[index], ...data };
    await fs.writeFile(this.path, JSON.stringify(products, null, 2));
    return products[index];
  }

  async deleteProduct(id) {
    const products = await this.getProducts();
    const filtered = products.filter((p) => p.id != id);
    await fs.writeFile(this.path, JSON.stringify(filtered, null, 2));
    return true;
  }
}

export default ProductManager;

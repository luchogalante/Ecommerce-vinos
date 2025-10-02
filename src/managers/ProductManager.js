import fs from "fs/promises";

class ProductManager {
  constructor(path) {
    this.path = path;
  }

  // ✅ Leer productos
  async getProducts() {
    try {
      const data = await fs.readFile(this.path, "utf-8");
      return JSON.parse(data);
    } catch (error) {
      return []; // Si el archivo está vacío o no existe
    }
  }

  // ✅ Buscar por ID
  async getProductById(id) {
    const products = await this.getProducts();
    return products.find((p) => p.id === id);
  }

  // ✅ Agregar producto
  async addProduct(productData) {
    const products = await this.getProducts();
    const newProduct = {
      id: Date.now().toString(), // Genera un ID único
      status: true,
      ...productData,
    };
    products.push(newProduct);
    await fs.writeFile(this.path, JSON.stringify(products, null, 2));
    return newProduct;
  }

  // ✅ Actualizar producto
  async updateProduct(id, updatedData) {
    const products = await this.getProducts();
    const index = products.findIndex((p) => p.id === id);
    if (index === -1) return null;
    products[index] = { ...products[index], ...updatedData, id }; // Mantener ID
    await fs.writeFile(this.path, JSON.stringify(products, null, 2));
    return products[index];
  }

  // ✅ Eliminar producto
  async deleteProduct(id) {
    const products = await this.getProducts();
    const filtered = products.filter((p) => p.id !== id);
    if (filtered.length === products.length) return null;
    await fs.writeFile(this.path, JSON.stringify(filtered, null, 2));
    return true;
  }
}

export default ProductManager;

import fs from "fs/promises";

class ProductManager {
  constructor(path) {
    this.path = path;
  }

  // ✅ Leer todos los productos
  async getProducts() {
    try {
      const data = await fs.readFile(this.path, "utf-8");
      return JSON.parse(data);
    } catch (error) {
      return []; // Si el archivo no existe o está vacío
    }
  }

  // ✅ Buscar producto por ID
  async getProductById(id) {
    const products = await this.getProducts();
    return products.find((p) => p.id === id);
  }

  // ✅ Agregar producto con todas las validaciones
  async addProduct(productData) {
    const requiredFields = [
      "title",
      "description",
      "code",
      "price",
      "stock",
      "category"
    ];

    // Verificar campos faltantes
    const missing = requiredFields.filter((field) => !productData[field]);
    if (missing.length > 0) {
      throw new Error(`Faltan campos requeridos: ${missing.join(", ")}`);
    }

    const products = await this.getProducts();

    // Validar que no se repita el código
    const existingCode = products.find((p) => p.code === productData.code);
    if (existingCode) {
      throw new Error(`El código '${productData.code}' ya existe.`);
    }

    const newProduct = {
      id: Date.now().toString(),
      status: productData.status ?? true,
      thumbnails: Array.isArray(productData.thumbnails)
        ? productData.thumbnails
        : [],
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

    // Si actualiza el código, verificar que no exista otro igual
    if (
      updatedData.code &&
      products.some((p) => p.code === updatedData.code && p.id !== id)
    ) {
      throw new Error("El código ingresado ya pertenece a otro producto.");
    }

    products[index] = { ...products[index], ...updatedData, id };
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

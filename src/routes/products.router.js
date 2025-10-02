import { Router } from "express";
import ProductManager from "../managers/ProductManager.js";

const router = Router();
const productManager = new ProductManager("src/data/products.json"); // ✅ Sin "./" para evitar rutas rotas

// ✅ GET /api/products
router.get("/", async (req, res) => {
  try {
    const products = await productManager.getProducts();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener productos" });
  }
});

// ✅ GET /api/products/:pid
router.get("/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    const product = await productManager.getProductById(pid);
    product ? res.json(product) : res.status(404).json({ error: "Producto no encontrado" });
  } catch (err) {
    res.status(500).json({ error: "Error al buscar producto" });
  }
});

// ✅ POST /api/products
router.post("/", async (req, res) => {
  try {
    const productData = req.body;
    if (!productData.title || !productData.price) {
      return res.status(400).json({ error: "Faltan datos obligatorios (title, price)" });
    }
    const newProduct = await productManager.addProduct(productData);
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(500).json({ error: "Error al agregar producto" });
  }
});

// ✅ PUT /api/products/:pid
router.put("/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    const updatedData = req.body;
    const result = await productManager.updateProduct(pid, updatedData);
    result ? res.json(result) : res.status(404).json({ error: "Producto no encontrado" });
  } catch (err) {
    res.status(500).json({ error: "Error al actualizar producto" });
  }
});

// ✅ DELETE /api/products/:pid
router.delete("/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    const result = await productManager.deleteProduct(pid);
    result ? res.json({ message: "Producto eliminado" }) : res.status(404).json({ error: "Producto no encontrado" });
  } catch (err) {
    res.status(500).json({ error: "Error al eliminar producto" });
  }
});

export default router;

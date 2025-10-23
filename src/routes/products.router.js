import { Router } from "express";
import ProductManager from "../managers/ProductManager.js";

const router = Router();
const productManager = new ProductManager("./src/data/products.json");

// ✅ GET /api/products
router.get("/", async (req, res) => {
  try {
    const products = await productManager.getProducts();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los productos" });
  }
});

// ✅ GET /api/products/:pid
router.get("/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    const product = await productManager.getProductById(pid);
    if (!product) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el producto" });
  }
});

// ✅ POST /api/products
router.post("/", async (req, res) => {
  try {
    console.log("📦 Body recibido:", req.body); // 👈 Verifica si llega el body

    const newProduct = await productManager.addProduct(req.body);
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ✅ PUT /api/products/:pid
router.put("/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    const updatedData = req.body;
    const result = await productManager.updateProduct(pid, updatedData);
    if (!result) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar el producto" });
  }
});

// ✅ DELETE /api/products/:pid
router.delete("/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    const result = await productManager.deleteProduct(pid);
    if (!result) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }
    res.json({ message: "Producto eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar el producto" });
  }
});

export default router;

import { Router } from "express";
import ProductModel from "../models/Product.model.js";

const router = Router();

// ✅ Obtener todos los productos
router.get("/", async (req, res) => {
  try {
    const products = await ProductModel.find();
    res.json(products);
  } catch (error) {
    console.error("❌ Error obteniendo productos:", error);
    res.status(500).json({ error: "Error obteniendo productos" });
  }
});

// ✅ Crear un nuevo producto
router.post("/", async (req, res) => {
  try {
    const product = await ProductModel.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    console.error("❌ Error creando producto:", error);
    res.status(500).json({ error: "Error creando producto" });
  }
});

export default router;

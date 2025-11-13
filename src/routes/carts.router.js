import { Router } from "express";
import CartModel from "../models/cart.model.js";

const router = Router();

// ➕ Crear un nuevo carrito
router.post("/", async (req, res) => {
  try {
    const cart = await CartModel.create({ products: [] });
    res.status(201).json(cart);
  } catch (error) {
    console.error("Error al crear carrito:", error);
    res.status(500).json({ error: "Error al crear carrito" });
  }
});

// 🛒 Obtener un carrito por ID (con los productos populados)
router.get("/:cid", async (req, res) => {
  try {
    const cart = await CartModel.findById(req.params.cid).populate("products.product");
    if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });

    res.json(cart);
  } catch (error) {
    console.error("Error al obtener carrito:", error);
    res.status(500).json({ error: "Error obteniendo carrito" });
  }
});

// ➕ Agregar un producto al carrito
router.post("/:cid/product/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const cart = await CartModel.findById(cid);

    if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });

    // Buscar si el producto ya existe en el carrito
    const existingProduct = cart.products.find(p => p.product.toString() === pid);

    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      cart.products.push({ product: pid, quantity: 1 });
    }

    await cart.save();
    res.json({ message: "Producto agregado correctamente ✅", cart });
  } catch (error) {
    console.error("Error agregando producto al carrito:", error);
    res.status(500).json({ error: "Error agregando producto al carrito" });
  }
});

export default router;

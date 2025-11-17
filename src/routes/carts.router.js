import { Router } from "express";
import CartMongoManager from "../managers/CartMongoManager.js";

const router = Router();
const cartManager = new CartMongoManager();

// --------------------------------------
// POST /api/carts → Crear carrito
// --------------------------------------
router.post("/", async (req, res) => {
  try {
    const cart = await cartManager.createCart();
    res.status(201).json({
      status: "success",
      cart
    });
  } catch (error) {
    console.error("❌ Error creando carrito:", error);
    res.status(500).json({ error: "Error creando carrito" });
  }
});

// --------------------------------------
// GET /api/carts/:cid → Obtener carrito con populate
// --------------------------------------
router.get("/:cid", async (req, res) => {
  try {
    const cart = await cartManager.getCartById(req.params.cid);

    if (!cart) {
      return res.status(404).json({ error: "Carrito no encontrado" });
    }

    res.json({
      status: "success",
      cart
    });
  } catch (error) {
    console.error("❌ Error obteniendo carrito:", error);
    res.status(500).json({ error: "Error obteniendo carrito" });
  }
});

// --------------------------------------
// POST /api/carts/:cid/product/:pid → Agregar producto
// --------------------------------------
router.post("/:cid/product/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;

    const updatedCart = await cartManager.addProductToCart(cid, pid);

    res.json({
      status: "success",
      cart: updatedCart
    });
  } catch (error) {
    console.error("❌ Error agregando producto al carrito:", error);
    res.status(500).json({ error: "Error agregando producto al carrito" });
  }
});

// --------------------------------------
// DELETE /api/carts/:cid/products/:pid → Eliminar un producto del carrito
// --------------------------------------
router.delete("/:cid/products/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;

    const updatedCart = await cartManager.removeProduct(cid, pid);

    if (!updatedCart) {
      return res.status(404).json({ error: "Carrito o producto no encontrado" });
    }

    res.json({ status: "success", cart: updatedCart });
  } catch (error) {
    console.error("❌ Error eliminando producto del carrito:", error);
    res.status(500).json({ error: "Error eliminando producto del carrito" });
  }
});

// --------------------------------------
// PUT /api/carts/:cid → Reemplazar TODO el carrito
// --------------------------------------
router.put("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const products = req.body.products;

    const updatedCart = await cartManager.updateCart(cid, products);

    if (!updatedCart) {
      return res.status(404).json({ error: "Carrito no encontrado" });
    }

    res.json({ status: "success", cart: updatedCart });
  } catch (error) {
    console.error("❌ Error actualizando carrito:", error);
    res.status(500).json({ error: "Error actualizando carrito" });
  }
});

// --------------------------------------
// PUT /api/carts/:cid/products/:pid → Actualizar cantidad
// --------------------------------------
router.put("/:cid/products/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    const updatedCart = await cartManager.updateQuantity(cid, pid, quantity);

    if (!updatedCart) {
      return res.status(404).json({ error: "Carrito o producto no encontrado" });
    }

    res.json({ status: "success", cart: updatedCart });
  } catch (error) {
    console.error("❌ Error actualizando cantidad:", error);
    res.status(500).json({ error: "Error actualizando cantidad" });
  }
});

// --------------------------------------
// DELETE /api/carts/:cid → Vaciar carrito completo
// --------------------------------------
router.delete("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;

    const updatedCart = await cartManager.clearCart(cid);

    if (!updatedCart) {
      return res.status(404).json({ error: "Carrito no encontrado" });
    }

    res.json({ status: "success", cart: updatedCart });
  } catch (error) {
    console.error("❌ Error vaciando carrito:", error);
    res.status(500).json({ error: "Error vaciando carrito" });
  }
});

export default router;

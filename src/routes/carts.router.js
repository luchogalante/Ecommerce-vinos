import { Router } from "express";
import CartMongoManager from "../managers/CartMongoManager.js";
import TicketModel from "../models/Ticket.model.js";
import ProductModel from "../models/Product.model.js";
import passport from "passport";
import authorization from "../middlewares/authorization.middleware.js";
import { v4 as uuidv4 } from "uuid";

const router = Router();
const cartManager = new CartMongoManager();

// ======================================
// TODAS LAS RUTAS PROTEGIDAS CON JWT
// ======================================

// Crear carrito
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const cart = await cartManager.createCart();
      res.status(201).json({ status: "success", cart });
    } catch {
      res.status(500).json({ error: "Error creando carrito" });
    }
  }
);

// Obtener carrito
router.get(
  "/:cid",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const cart = await cartManager.getCartById(req.params.cid);

      if (!cart)
        return res.status(404).json({ error: "Carrito no encontrado" });

      res.json({ status: "success", cart });
    } catch {
      res.status(500).json({ error: "Error obteniendo carrito" });
    }
  }
);

// ⭐ AGREGAR producto
router.post(
  "/:cid/product/:pid",
  passport.authenticate("jwt", { session: false }),
  authorization(["user", "admin"]),
  async (req, res) => {
    try {
      const updatedCart = await cartManager.addProductToCart(
        req.params.cid,
        req.params.pid
      );

      res.json({ status: "success", cart: updatedCart });
    } catch {
      res.status(500).json({ error: "Error agregando producto" });
    }
  }
);

// Eliminar producto
router.delete(
  "/:cid/products/:pid",
  passport.authenticate("jwt", { session: false }),
  authorization(["user", "admin"]),
  async (req, res) => {
    try {
      const updatedCart = await cartManager.removeProduct(
        req.params.cid,
        req.params.pid
      );

      if (!updatedCart)
        return res.status(404).json({ error: "No encontrado" });

      res.json({ status: "success", cart: updatedCart });
    } catch {
      res.status(500).json({ error: "Error eliminando producto" });
    }
  }
);

// Reemplazar carrito
router.put(
  "/:cid",
  passport.authenticate("jwt", { session: false }),
  authorization(["user", "admin"]),
  async (req, res) => {
    try {
      const updatedCart = await cartManager.updateCart(
        req.params.cid,
        req.body.products
      );

      if (!updatedCart)
        return res.status(404).json({ error: "Carrito no encontrado" });

      res.json({ status: "success", cart: updatedCart });
    } catch {
      res.status(500).json({ error: "Error actualizando carrito" });
    }
  }
);

// Actualizar cantidad
router.put(
  "/:cid/products/:pid",
  passport.authenticate("jwt", { session: false }),
  authorization(["user", "admin"]),
  async (req, res) => {
    try {
      const updatedCart = await cartManager.updateQuantity(
        req.params.cid,
        req.params.pid,
        req.body.quantity
      );

      if (!updatedCart)
        return res.status(404).json({ error: "No encontrado" });

      res.json({ status: "success", cart: updatedCart });
    } catch {
      res.status(500).json({ error: "Error actualizando cantidad" });
    }
  }
);

// Vaciar carrito
router.delete(
  "/:cid",
  passport.authenticate("jwt", { session: false }),
  authorization(["user", "admin"]),
  async (req, res) => {
    try {
      const updatedCart = await cartManager.clearCart(req.params.cid);

      if (!updatedCart)
        return res.status(404).json({ error: "Carrito no encontrado" });

      res.json({ status: "success", cart: updatedCart });
    } catch {
      res.status(500).json({ error: "Error vaciando carrito" });
    }
  }
);

// ======================================
// ⭐ PURCHASE ⭐
// ======================================
router.post(
  "/:cid/purchase",
  passport.authenticate("jwt", { session: false }),
  authorization(["user", "admin"]),
  async (req, res) => {
    try {
      const cart = await cartManager.getCartById(req.params.cid);

      if (!cart)
        return res.status(404).send({ error: "Carrito no encontrado" });

      let totalAmount = 0;
      const notPurchased = [];

      for (const item of cart.products) {
        const product = await ProductModel.findById(item.product._id);

        if (product.stock >= item.quantity) {
          product.stock -= item.quantity;
          await product.save();
          totalAmount += product.price * item.quantity;
        } else {
          notPurchased.push(item);
        }
      }

      cart.products = notPurchased;
      await cart.save();

      let ticket = null;

      if (totalAmount > 0) {
        ticket = await TicketModel.create({
          code: uuidv4(),
          amount: totalAmount,
          purchaser: req.user.email
        });
      }

      res.send({
        status: "success",
        ticket,
        notPurchased
      });

    } catch {
      res.status(500).send({ error: "Error procesando compra" });
    }
  }
);

export default router;

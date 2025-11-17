import CartModel from "../models/Cart.model.js";

export default class CartMongoManager {

  // Crear carrito vacío
  async createCart() {
    try {
      const newCart = await CartModel.create({ products: [] });
      return newCart;
    } catch (error) {
      console.error("Error en createCart:", error);
      throw error;
    }
  }

  // Buscar carrito por ID con populate
  async getCartById(id) {
    try {
      return await CartModel.findById(id).populate("products.product");
    } catch (error) {
      console.error("Error en getCartById:", error);
      throw error;
    }
  }

  // Agregar producto al carrito
  async addProductToCart(cartId, productId) {
    try {
      const cart = await CartModel.findById(cartId);
      if (!cart) return null;

      const productIndex = cart.products.findIndex(
        (p) => p.product.toString() === productId
      );

      if (productIndex !== -1) {
        cart.products[productIndex].quantity++;
      } else {
        cart.products.push({ product: productId, quantity: 1 });
      }

      await cart.save();
      return await cart.populate("products.product");

    } catch (error) {
      console.error("Error en addProductToCart:", error);
      throw error;
    }
  }

  // -----------------------------------------
  // ❌ ELIMINAR PRODUCTO DEL CARRITO
  // -----------------------------------------
  async removeProduct(cartId, productId) {
    try {
      const cart = await CartModel.findById(cartId);
      if (!cart) return null;

      cart.products = cart.products.filter(
        (p) => p.product.toString() !== productId
      );

      await cart.save();
      return await cart.populate("products.product");

    } catch (error) {
      console.error("Error en removeProduct:", error);
      throw error;
    }
  }

  // -----------------------------------------
  // 🔄 REEMPLAZAR TODO EL CARRITO
  // -----------------------------------------
  async updateCart(cartId, productsArray) {
    try {
      const cart = await CartModel.findById(cartId);
      if (!cart) return null;

      cart.products = productsArray;

      await cart.save();
      return await cart.populate("products.product");

    } catch (error) {
      console.error("Error en updateCart:", error);
      throw error;
    }
  }

  // -----------------------------------------
  // 🔢 ACTUALIZAR SOLO LA CANTIDAD DE UN PRODUCTO
  // -----------------------------------------
  async updateQuantity(cartId, productId, quantity) {
    try {
      const cart = await CartModel.findById(cartId);
      if (!cart) return null;

      const productIndex = cart.products.findIndex(
        (p) => p.product.toString() === productId
      );

      if (productIndex === -1) return null;

      cart.products[productIndex].quantity = quantity;

      await cart.save();
      return await cart.populate("products.product");

    } catch (error) {
      console.error("Error en updateQuantity:", error);
      throw error;
    }
  }

  // -----------------------------------------
  // 🗑️ VACIAR CARRITO
  // -----------------------------------------
  async clearCart(cartId) {
    try {
      const cart = await CartModel.findById(cartId);
      if (!cart) return null;

      cart.products = [];

      await cart.save();
      return cart;

    } catch (error) {
      console.error("Error en clearCart:", error);
      throw error;
    }
  }
}



import fs from "fs/promises";

class CartManager {
  constructor(path) {
    this.path = path;
  }

  // ✅ Leer carritos
  async getCarts() {
    const data = await fs.readFile(this.path, "utf-8");
    return JSON.parse(data);
  }

  // ✅ Buscar carrito por ID
  async getCartById(id) {
    const carts = await this.getCarts();
    return carts.find((c) => c.id === id);
  }

  // ✅ Crear nuevo carrito
  async createCart() {
    const carts = await this.getCarts();
    const newCart = {
      id: Date.now().toString(),
      products: [],
    };
    carts.push(newCart);
    await fs.writeFile(this.path, JSON.stringify(carts, null, 2));
    return newCart;
  }

  // ✅ Agregar producto al carrito
  async addProductToCart(cid, pid) {
    const carts = await this.getCarts();
    const cart = carts.find((c) => c.id === cid);
    if (!cart) return null;

    const productInCart = cart.products.find((p) => p.product === pid);
    if (productInCart) {
      productInCart.quantity += 1;
    } else {
      cart.products.push({ product: pid, quantity: 1 });
    }

    await fs.writeFile(this.path, JSON.stringify(carts, null, 2));
    return cart;
  }
}

export default CartManager;

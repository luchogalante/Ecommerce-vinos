import { Router } from "express";
import ProductMongoManager from "../managers/ProductMongoManager.js";
import CartMongoManager from "../managers/CartMongoManager.js";

const router = Router();
const productService = new ProductMongoManager();
const cartService = new CartMongoManager();

// --------------------------------------
// LOGIN
// --------------------------------------
router.get("/login", (req, res) => {
  res.render("login");
});

// --------------------------------------
// REGISTER (opcional)
// --------------------------------------
router.get("/register", (req, res) => {
  res.render("register");
});

// --------------------------------------
// HOME (PROTEGIDO)
// --------------------------------------
router.get("/", async (req, res) => {
  try {
    // 🔐 Si no está logueado → login
    if (!req.cookies.token) {
      return res.redirect("/login");
    }

    const result = await productService.getProducts({}, { limit: 100 });
    const products = result.docs;

    res.render("home", { products });
  } catch (error) {
    res.status(500).send("Error cargando home");
  }
});

// --------------------------------------
// REAL TIME PRODUCTS
// --------------------------------------
router.get("/realtimeproducts", async (req, res) => {
  try {
    if (!req.cookies.token) {
      return res.redirect("/login");
    }

    const result = await productService.getProducts({}, { limit: 100 });
    const products = result.docs;

    res.render("realTimeProducts", { products });
  } catch (error) {
    res.status(500).send("Error cargando vista realtime");
  }
});

// --------------------------------------
// PRODUCTS (paginada)
// --------------------------------------
router.get("/products", async (req, res) => {
  try {
    if (!req.cookies.token) {
      return res.redirect("/login");
    }

    const { page = 1 } = req.query;

    const result = await productService.getProducts({}, {
      page,
      limit: 5,
      lean: true
    });

    res.render("products", {
      products: result.docs,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink: result.hasPrevPage ? `/products?page=${result.prevPage}` : null,
      nextLink: result.hasNextPage ? `/products?page=${result.nextPage}` : null
    });

  } catch (error) {
    console.log(error);
    res.status(500).send("Error cargando productos");
  }
});

// --------------------------------------
// CART por ID
// --------------------------------------
router.get("/carts/:cid", async (req, res) => {
  try {
    if (!req.cookies.token) {
      return res.redirect("/login");
    }

    const cart = await cartService.getCartById(req.params.cid);
    res.render("cart", { cart });
  } catch (error) {
    console.log(error);
    res.status(500).send("Error cargando carrito");
  }
});

export default router;

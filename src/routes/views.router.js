import { Router } from "express";
import ProductManager from "../managers/ProductManager.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = Router();
const productManager = new ProductManager(path.join(__dirname, "../data/products.json"));

// Home
router.get("/", async (req, res) => {
  const products = await productManager.getProducts();
  res.render("home", { products });
});

// Vista realtime con sockets
router.get("/realtimeproducts", async (req, res) => {
  const products = await productManager.getProducts();
  res.render("realTimeProducts", { products });
});

export default router;

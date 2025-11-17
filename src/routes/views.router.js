import { Router } from "express";
import ProductMongoManager from "../managers/ProductMongoManager.js";

const router = Router();
const productService = new ProductMongoManager();

// --------------------------------------
// HOME (lista de productos desde Mongo)
// --------------------------------------
router.get("/", async (req, res) => {
  try {
    const result = await productService.getProducts({}, { limit: 100 });
    const products = result.docs; // paginate devuelve docs

    res.render("home", { products });
  } catch (error) {
    console.error("❌ Error cargando home:", error);
    res.status(500).send("Error cargando home");
  }
});

// --------------------------------------
// REAL TIME PRODUCTS (Socket + Mongo)
// --------------------------------------
router.get("/realtimeproducts", async (req, res) => {
  try {
    const result = await productService.getProducts({}, { limit: 100 });
    const products = result.docs;

    res.render("realTimeProducts", { products });
  } catch (error) {
    console.error("❌ Error cargando realtime:", error);
    res.status(500).send("Error cargando vista realtime");
  }
});

export default router;

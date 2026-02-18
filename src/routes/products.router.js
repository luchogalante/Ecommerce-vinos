import { Router } from "express";
import passport from "passport";
import authorization from "../middlewares/authorization.middleware.js";
import ProductRepository from "../repositories/Product.repository.js";

const router = Router();
const productService = new ProductRepository();

// ------------------------------------------
// GET /api/products → público
// ------------------------------------------
router.get("/", async (req, res) => {
  try {
    const { limit, page, sort, query } = req.query;
    let filter = {};

    if (query) {
      if (query.includes(":")) {
        const [field, value] = query.split(":");
        filter[field] = value;
      } else {
        filter.category = query;
      }
    }

    const options = {
      limit: Number(limit) || 10,
      page: Number(page) || 1,
      sort: sort ? { price: sort === "asc" ? 1 : -1 } : undefined,
      lean: true
    };

    const result = await productService.getProducts(filter, options);

    res.json({
      status: "success",
      payload: result.docs,
      totalPages: result.totalPages,
      page: result.page
    });

  } catch (error) {
    res.status(500).json({ error: "Error obteniendo productos" });
  }
});

// ------------------------------------------
// GET /api/products/:pid → público
// ------------------------------------------
router.get("/:pid", async (req, res) => {
  try {
    const product = await productService.getProductById(req.params.pid);

    if (!product) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    res.json({ status: "success", product });

  } catch (error) {
    res.status(500).json({ error: "Error obteniendo producto" });
  }
});

// ------------------------------------------
// POST → SOLO ADMIN
// ------------------------------------------
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  authorization("admin"),
  async (req, res) => {
    try {
      const product = await productService.createProduct(req.body);

      const io = req.app.get("io");
      io.emit("productAdded", product);

      res.status(201).json({
        status: "success",
        product
      });

    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
);

// ------------------------------------------
// PUT → SOLO ADMIN
// ------------------------------------------
router.put(
  "/:pid",
  passport.authenticate("jwt", { session: false }),
  authorization("admin"),
  async (req, res) => {
    try {
      const updated = await productService.updateProduct(
        req.params.pid,
        req.body
      );

      if (!updated) {
        return res.status(404).json({ error: "Producto no encontrado" });
      }

      res.json({ status: "success", updated });

    } catch (error) {
      res.status(500).json({ error: "Error actualizando producto" });
    }
  }
);

// ------------------------------------------
// DELETE → SOLO ADMIN
// ------------------------------------------
router.delete(
  "/:pid",
  passport.authenticate("jwt", { session: false }),
  authorization("admin"),
  async (req, res) => {
    try {
      const deleted = await productService.deleteProduct(req.params.pid);

      if (!deleted) {
        return res.status(404).json({ error: "Producto no encontrado" });
      }

      const io = req.app.get("io");
      io.emit("productDeleted", req.params.pid);

      res.json({ status: "success", deleted });

    } catch (error) {
      res.status(500).json({ error: "Error eliminando producto" });
    }
  }
);

export default router;

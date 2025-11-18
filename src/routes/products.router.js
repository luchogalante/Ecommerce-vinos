import { Router } from "express";
import ProductMongoManager from "../managers/ProductMongoManager.js";

const router = Router();
const productService = new ProductMongoManager();

// ------------------------------------------
// GET /api/products → Listado con paginate
// ------------------------------------------
router.get("/", async (req, res) => {
  try {
    const { limit, page, sort, query } = req.query;

    let filter = {};

    // QUERY (categoría o disponibilidad)
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
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink: result.hasPrevPage
        ? `/api/products?page=${result.prevPage}`
        : null,
      nextLink: result.hasNextPage
        ? `/api/products?page=${result.nextPage}`
        : null
    });

  } catch (error) {
    console.error("Error en GET /api/products:", error);
    res.status(500).json({ error: "Error obteniendo productos" });
  }
});

// ------------------------------------------
// GET /api/products/:pid → Producto por ID
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
// POST /api/products → Crear producto
// ------------------------------------------
router.post("/", async (req, res) => {
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
});

// ------------------------------------------
// PUT /api/products/:pid → Actualizar producto
// ------------------------------------------
router.put("/:pid", async (req, res) => {
  try {
    const updated = await productService.updateProduct(req.params.pid, req.body);

    if (!updated) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    res.json({ status: "success", updated });
  } catch (error) {
    res.status(500).json({ error: "Error actualizando producto" });
  }
});

// ------------------------------------------
// DELETE /api/products/:pid → Eliminar producto
// ------------------------------------------
router.delete("/:pid", async (req, res) => {
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
});

export default router;

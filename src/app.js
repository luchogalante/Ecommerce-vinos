import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { engine } from "express-handlebars";
import path from "path";
import { fileURLToPath } from "url";

import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import ProductManager from "./managers/ProductManager.js";

const app = express();
const PORT = 8080;

// 📂 Rutas absolutas
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ⚙️ Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// 🧠 Configuración de Handlebars
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

// 📦 Instancia del ProductManager
const productManager = new ProductManager(path.join(__dirname, "data", "products.json"));

// 🛣️ Rutas API
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

// 🏠 Vista Home
app.get("/", async (req, res) => {
  const products = await productManager.getProducts();
  res.render("home", { products });
});

// ⚡ Vista en tiempo real
app.get("/realtimeproducts", (req, res) => {
  res.render("realTimeProducts"); // 👈 No pasamos los productos
});

// 🚀 Servidor HTTP + Socket.io
const httpServer = createServer(app);
const io = new Server(httpServer);

// 💬 WebSocket: conexión
io.on("connection", async (socket) => {
  console.log("🟢 Cliente conectado");

  // Enviar lista inicial al conectarse
  socket.emit("updateProducts", await productManager.getProducts());

  // Agregar producto
  socket.on("addProduct", async (productData) => {
    await productManager.addProduct(productData);
    io.emit("updateProducts", await productManager.getProducts());
  });

  // Eliminar producto
  socket.on("deleteProduct", async (id) => {
    await productManager.deleteProduct(id);
    io.emit("updateProducts", await productManager.getProducts());
  });
});

// 🟢 Iniciar servidor
httpServer.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});

import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js"; // ✅ Falta este import!
import ProductManager from "./managers/ProductManager.js";
import path from "path";
import { fileURLToPath } from "url";
import handlebars from "express-handlebars";
import mongoose from "mongoose";

// Fix para __dirname en ESModules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

// ✅ CONEXIÓN A MONGO ATLAS
const MONGO_URL = "mongodb+srv://luchogalante:Millonarios10@cluster0.sxanjxx.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0";

mongoose
  .connect(MONGO_URL)
  .then(() => console.log("🍃 Conectado a MongoDB Atlas OK"))
  .catch((err) => console.log("❌ Error conectando a MongoDB:", err));

// ✅ ProductManager usa JSON por ahora (más adelante lo migramos a Mongo)
const productManager = new ProductManager(
  path.join(__dirname, "data", "products.json")
);

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Handlebars config
app.engine("handlebars", handlebars.engine());
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "handlebars");

// Rutas API
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter); // ✅ Ahora sí funciona

// Vista Real Time Products
app.get("/realtimeproducts", async (req, res) => {
  const products = await productManager.getProducts();
  res.render("realTimeProducts", { products });
});

// Test route
app.get("/", (req, res) => {
  res.send("Servidor funcionando 🚀");
});

// Socket
io.on("connection", async (socket) => {
  console.log("✅ Cliente conectado", socket.id);

  const products = await productManager.getProducts();
  socket.emit("updateProducts", products);
});

// Levantar server
const PORT = 8080;
httpServer.listen(PORT, () => {
  console.log(`🔥 Servidor corriendo en http://localhost:${PORT}`);
});

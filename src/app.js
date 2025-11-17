import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import viewsRouter from "./routes/views.router.js";
import path from "path";
import { fileURLToPath } from "url";
import handlebars from "express-handlebars";
import mongoose from "mongoose";

// Fix __dirname en ESModules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

// ⭐ Hacer IO accesible en los routers
app.set("io", io);

// --------------------------------------------
// MONGO ATLAS
// --------------------------------------------
const MONGO_URL =
  "mongodb+srv://luchogalante:Millonarios10@cluster0.sxanjxx.mongodb.net/ecommerce?retryWrites=true&w=majority";

mongoose
  .connect(MONGO_URL)
  .then(() => console.log("🍃 Conectado a MongoDB Atlas OK"))
  .catch((err) => console.log("❌ Error conectando a MongoDB:", err));

// --------------------------------------------
// MIDDLEWARES
// --------------------------------------------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// --------------------------------------------
// HANDLEBARS CONFIG - SOLUCIÓN AL PROBLEMA
// --------------------------------------------
app.engine(
  "handlebars",
  handlebars.engine({
    defaultLayout: "main",
    layoutsDir: path.join(__dirname, "views/layouts"),
    runtimeOptions: {
      allowProtoPropertiesByDefault: true,
      allowProtoMethodsByDefault: true
    }
  })
);

app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

// --------------------------------------------
// ROUTES
// --------------------------------------------
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);

// --------------------------------------------
// SOCKET.IO
// --------------------------------------------
io.on("connection", (socket) => {
  console.log("🟢 Usuario conectado");

  socket.on("disconnect", () => {
    console.log("🔴 Usuario desconectado");
  });
});

// --------------------------------------------
// SERVER
// --------------------------------------------
const PORT = 8080;
httpServer.listen(PORT, () => {
  console.log(`🚀 Server ON en http://localhost:${PORT}`);
});

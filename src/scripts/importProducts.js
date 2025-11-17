import mongoose from "mongoose";
import ProductModel from "../models/Product.model.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Fix __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// URL completa de MongoDB (la misma que usás en app.js)
const MONGO_URL =
  "mongodb+srv://luchogalante:Millonarios10@cluster0.sxanjxx.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0";

const run = async () => {
  try {
    console.log("⏳ Conectando a Mongo...");
    await mongoose.connect(MONGO_URL);
    console.log("🍃 Mongo conectado");

    // Ruta del JSON viejo
    const filePath = path.join(__dirname, "../data/products.json");

    const rawData = fs.readFileSync(filePath, "utf8");
    const products = JSON.parse(rawData);

    // Limpiamos colección
    await ProductModel.deleteMany({});
    console.log("🧹 Productos anteriores eliminados");

    // Insertamos nuevos
    await ProductModel.insertMany(products);
    console.log("✅ Productos importados correctamente");

    process.exit();
  } catch (err) {
    console.error("❌ Error importando:", err);
    process.exit(1);
  }
};

run();

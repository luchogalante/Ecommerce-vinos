import mongoose from "mongoose";

const productCollection = "products";

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  thumbnail: { type: String },
  code: { type: String, required: true, unique: true },
  stock: { type: Number, required: true }
});

// ✅ Si el modelo ya existe, usa ese, si no, lo crea
const ProductModel = mongoose.models[productCollection] || mongoose.model(productCollection, productSchema);

export default ProductModel;

import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const productCollection = "products";

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    thumbnail: { type: String, default: "" },
    code: { type: String, required: true, unique: true },
    stock: { type: Number, required: true, min: 0 },
    category: { type: String, default: "general" }
  },
  {
    timestamps: true
  }
);

// ⭐ Habilitar paginación
productSchema.plugin(mongoosePaginate);

// Si el modelo ya existe, usarlo, sino crearlo
const ProductModel =
  mongoose.models[productCollection] ||
  mongoose.model(productCollection, productSchema);

export default ProductModel;

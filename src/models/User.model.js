import mongoose from "mongoose";

const usersCollection = "users";

const userSchema = new mongoose.Schema(
  {
    first_name: {
      type: String,
      required: true
    },
    last_name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    age: {
      type: Number,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    cart: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "carts"
    },
    role: {
      type: String,
      default: "user"
    }
  },
  {
    timestamps: true
  }
);

// ✅ Evita error de modelo duplicado con nodemon
const UserModel =
  mongoose.models[usersCollection] ||
  mongoose.model(usersCollection, userSchema);

export default UserModel;

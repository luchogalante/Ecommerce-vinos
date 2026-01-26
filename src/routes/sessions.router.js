import { Router } from "express";
import jwt from "jsonwebtoken";
import passport from "passport";
import UserModel from "../models/User.model.js";
import { createHash, isValidPassword } from "../utils/hash.js";

const router = Router();

// --------------------------------
// REGISTER
// --------------------------------
router.post("/register", async (req, res) => {
  const { first_name, last_name, email, age, password } = req.body;

  if (!email || !password) {
    return res.status(400).send({ error: "Datos incompletos" });
  }

  const exists = await UserModel.findOne({ email });
  if (exists) {
    return res.status(400).send({ error: "Usuario ya existe" });
  }

  const newUser = {
    first_name,
    last_name,
    email,
    age,
    password: createHash(password),
    role: "user"
  };

  const user = await UserModel.create(newUser);

  res.status(201).send({
    status: "success",
    user
  });
});

// --------------------------------
// LOGIN
// --------------------------------
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await UserModel.findOne({ email });
  if (!user) {
    return res.status(401).send({ error: "Usuario no existe" });
  }

  if (!isValidPassword(user, password)) {
    return res.status(401).send({ error: "Password incorrecto" });
  }

  const token = jwt.sign(
    {
      id: user._id,
      role: user.role,
      email: user.email
    },
    "coderhouse",
    { expiresIn: "1h" }
  );

  res
    .cookie("token", token, {
      httpOnly: true,
      maxAge: 60 * 60 * 1000
    })
    .send({
      status: "success",
      message: "Login OK"
    });
});

// --------------------------------
// CURRENT (PROTEGIDA)
// --------------------------------
router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { password, ...userSafe } = req.user.toObject();

    res.send({
      status: "success",
      user: userSafe
    });
  }
);

export default router;


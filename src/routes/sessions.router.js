import crypto from "crypto";
import { transporter } from "../config/mailer.js";
import { Router } from "express";
import jwt from "jsonwebtoken";
import passport from "passport";
import UserModel from "../models/User.model.js";
import { createHash, isValidPassword } from "../utils/hash.js";
import UserCurrentDTO from "../dto/UserCurrent.dto.js";

const router = Router();

// REGISTER
router.post("/register", async (req, res) => {
  const { first_name, last_name, email, age, password } = req.body;

  if (!email || !password) {
    return res.status(400).send({ error: "Datos incompletos" });
  }

  const exists = await UserModel.findOne({ email });
  if (exists) {
    return res.status(400).send({ error: "Usuario ya existe" });
  }

  const user = await UserModel.create({
    first_name,
    last_name,
    email,
    age,
    password: createHash(password),
    role: "user"
  });

  res.status(201).send({ status: "success", user });
});

// LOGIN
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
    { id: user._id, role: user.role, email: user.email },
    "coderhouse",
    { expiresIn: "1h" }
  );

  res.cookie("token", token, {
    httpOnly: true,
    maxAge: 60 * 60 * 1000
  });

  res.send({ status: "success", message: "Login OK" });
});

// FORGOT PASSWORD
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  const user = await UserModel.findOne({ email });
  if (!user) {
    return res.status(404).send({ error: "Usuario no encontrado" });
  }

  const token = crypto.randomBytes(20).toString("hex");

  user.resetToken = token;
  user.resetTokenExpire = Date.now() + 3600000;
  await user.save();

  const resetLink = `http://localhost:8080/reset-password/${token}`;

  await transporter.sendMail({
    from: process.env.MAIL_USER,
    to: user.email,
    subject: "Recuperar contraseña",
    html: `
      <h2>Restablecer contraseña</h2>
      <a href="${resetLink}">
        <button>Reset Password</button>
      </a>
    `
  });

  res.send({ status: "Mail enviado" });
});

// RESET PASSWORD
router.post("/reset-password/:token", async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const user = await UserModel.findOne({
    resetToken: token,
    resetTokenExpire: { $gt: Date.now() }
  });

  if (!user) {
    return res.status(400).send({ error: "Token inválido o expirado" });
  }

  if (isValidPassword(user, password)) {
    return res.status(400).send({ error: "No podés usar la misma contraseña" });
  }

  user.password = createHash(password);
  user.resetToken = undefined;
  user.resetTokenExpire = undefined;
  await user.save();

  res.send({ status: "Password actualizada" });
});

// CURRENT
router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const fullUser = await UserModel.findById(req.user.id);

      if (!fullUser) {
        return res.status(404).send({ error: "Usuario no encontrado" });
      }

      const userDTO = new UserCurrentDTO(fullUser);

      res.send({
        status: "success",
        user: userDTO
      });

    } catch (error) {
      res.status(500).send({ error: "Error obteniendo usuario actual" });
    }
  }
);

export default router;

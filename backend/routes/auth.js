import express from "express";
import jwt from "jsonwebtoken";
import { body, validationResult } from "express-validator";
import User from "../models/User.js";

const router = express.Router();

function signToken(userId) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
}

function firstError(req) {
  const errs = validationResult(req);
  return errs.isEmpty() ? null : errs.array()[0].msg;
}

function decodeToken(req) {
  const h = req.headers.authorization;
  if (!h?.startsWith("Bearer ")) return null;
  try { return jwt.verify(h.split(" ")[1], process.env.JWT_SECRET); }
  catch { return null; }
}

// ── POST /api/auth/register ───────────────────────────────────────────────────
router.post("/register",
  [
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Enter a valid email"),
    body("password").isLength({ min: 8 }).withMessage("Password must be at least 8 characters"),
  ],
  async (req, res) => {
    const err = firstError(req);
    if (err) return res.status(400).json({ error: err });

    const { name, email, password } = req.body;
    try {
      const exists = await User.findOne({ email: email.toLowerCase().trim() });
      if (exists) return res.status(409).json({ error: "An account with this email already exists" });

      const user  = await User.create({ name, email, password });
      const token = signToken(user._id);
      return res.status(201).json({ token, user });
    } catch (e) {
      if (e.code === 11000) return res.status(409).json({ error: "An account with this email already exists" });
      console.error("Register error:", e.message);
      return res.status(500).json({ error: "Registration failed — please try again" });
    }
  }
);

// ── POST /api/auth/login ──────────────────────────────────────────────────────
router.post("/login",
  [
    body("email").isEmail().withMessage("Enter a valid email"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  async (req, res) => {
    const err = firstError(req);
    if (err) return res.status(400).json({ error: err });

    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email: email.toLowerCase().trim() });
      if (!user || !(await user.comparePassword(password)))
        return res.status(401).json({ error: "Invalid email or password" });

      return res.json({ token: signToken(user._id), user });
    } catch (e) {
      console.error("Login error:", e.message);
      return res.status(500).json({ error: "Login failed — please try again" });
    }
  }
);

// ── GET /api/auth/me ──────────────────────────────────────────────────────────
router.get("/me", async (req, res) => {
  const decoded = decodeToken(req);
  if (!decoded) return res.status(401).json({ error: "Not authenticated" });
  const user = await User.findById(decoded.id);
  if (!user) return res.status(404).json({ error: "User not found" });
  return res.json({ user });
});

// ── PATCH /api/auth/profile ───────────────────────────────────────────────────
router.patch("/profile", async (req, res) => {
  const decoded = decodeToken(req);
  if (!decoded) return res.status(401).json({ error: "Not authenticated" });

  const { name, location, currentPassword, newPassword } = req.body;
  try {
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    if (name?.trim())     user.name     = name.trim();
    if (location?.trim()) user.location = location.trim();

    // Password change (optional)
    if (newPassword) {
      if (!currentPassword) return res.status(400).json({ error: "Current password is required to set a new one" });
      if (!(await user.comparePassword(currentPassword)))
        return res.status(401).json({ error: "Current password is incorrect" });
      if (newPassword.length < 8)
        return res.status(400).json({ error: "New password must be at least 8 characters" });
      user.password = newPassword;
    }

    await user.save();
    return res.json({ user });
  } catch (e) {
    console.error("Profile update error:", e.message);
    return res.status(500).json({ error: "Profile update failed" });
  }
});

export default router;

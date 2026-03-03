import express from "express";
import { body, validationResult } from "express-validator";
import { ask } from "../services/llmService.js";

const router = express.Router();

// POST /api/guide
router.post(
  "/",
  [body("prompt").trim().notEmpty().isLength({ max: 2000 })],
  async (req, res) => {
    const errs = validationResult(req);
    if (!errs.isEmpty()) return res.status(400).json({ error: "Prompt is required (max 2000 chars)" });

    try {
      const guidance = await ask(req.body.prompt);
      res.json({ guidance });
    } catch (err) {
      console.error("Guide error:", err.message);
      res.status(500).json({ error: "AI request failed — please try again" });
    }
  }
);

export default router;

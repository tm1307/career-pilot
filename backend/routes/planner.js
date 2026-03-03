import express from "express";
import { ask } from "../services/llmService.js";
import Plan from "../models/Plan.js";

const router = express.Router();

// POST /api/planner
router.post("/", async (req, res) => {
  const { goal, level, skills, timeline } = req.body;
  if (!goal) return res.status(400).json({ error: "Target role is required" });

  const timeUnit = timeline?.includes("month") || timeline?.includes("Year") ? "Months" : "Weeks";

  const prompt = `
You are a Senior Career Coach. Generate a career roadmap as strict JSON only — no markdown, no commentary.

User:
- Goal: ${goal}
- Level: ${level || "Beginner"}
- Skills: ${skills || "None"}
- Timeline: ${timeline || "3 months"}

Return this exact JSON shape:
{
  "roadmap": [
    {
      "week": "${timeUnit} 1",
      "topic": "Focus Area",
      "action_items": ["Task 1", "Task 2", "Task 3"],
      "resources": "Resource name or URL"
    }
  ]
}
`.trim();

  try {
    const data = await ask(prompt, { json: true });

    // Persist to DB (userId optional, works for guests too)
    await Plan.create({
      userId: req.body.userId || null,
      goal,
      level,
      steps: (data.roadmap || []).map((s) => s.topic),
    }).catch(() => {}); // non-fatal

    res.json(data);
  } catch (err) {
    console.error("Planner error:", err.message);
    res.status(500).json({ error: "Failed to generate roadmap — please try again" });
  }
});

export default router;

import express from "express";
import { ask } from "../services/llmService.js";

const router = express.Router();

// POST /api/builder/generate
// Body: { name, email, phone, role, summary, education[], experience[], projects[], skills[] }
router.post("/generate", async (req, res) => {
  const { name, email, phone, role, education, experience, projects, skills } = req.body;
  if (!name || !role) return res.status(400).json({ error: "Name and target role are required" });

  const prompt = `
You are an expert resume writer. Write polished, ATS-optimized resume content as strict JSON only — no markdown, no commentary.

User input:
- Name: ${name}
- Target Role: ${role}
- Email: ${email || ""}
- Phone: ${phone || ""}
- Education: ${JSON.stringify(education || [])}
- Experience: ${JSON.stringify(experience || [])}
- Projects: ${JSON.stringify(projects || [])}
- Skills: ${(skills || []).join(", ")}

Generate professional, action-verb-driven bullet points. Return exactly:
{
  "summary": "2-3 sentence professional summary for the role",
  "education": [{ "degree": "", "institution": "", "year": "", "gpa": "" }],
  "experience": [{ "title": "", "company": "", "duration": "", "bullets": ["achievement 1", "achievement 2", "achievement 3"] }],
  "projects": [{ "name": "", "tech": "", "bullets": ["detail 1", "detail 2"] }],
  "skills": ["skill1", "skill2"]
}
`.trim();

  try {
    const content = await ask(prompt, { json: true });
    res.json(content);
  } catch (err) {
    console.error("Builder error:", err.message);
    res.status(500).json({ error: "Failed to generate resume — please try again" });
  }
});

export default router;

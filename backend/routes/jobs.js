import express from "express";
import { fetchAllJobs } from "../services/jobFetcher.js";

const router = express.Router();

// GET /api/jobs?source=Remote|India|Unstop&search=react
router.get("/", async (req, res) => {
  try {
    let jobs = await fetchAllJobs();

    const { source, search } = req.query;
    if (source && source !== "all") {
      jobs = jobs.filter((j) => j.source === source);
    }
    if (search) {
      const q = search.toLowerCase();
      jobs = jobs.filter(
        (j) =>
          j.title?.toLowerCase().includes(q) ||
          j.company?.toLowerCase().includes(q) ||
          j.tags?.some((t) => t.toLowerCase().includes(q))
      );
    }

    res.json(jobs);
  } catch (err) {
    console.error("Jobs route error:", err.message);
    res.status(500).json({ error: "Failed to fetch jobs" });
  }
});

export default router;

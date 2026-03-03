import express from "express";
import { fetchHackathons } from "../services/hackathonFetcher.js";

const router = express.Router();

// GET /api/hackathons?location=Bangalore&mode=Online
router.get("/", async (req, res) => {
  try {
    let hackathons = await fetchHackathons();

    const { location, mode } = req.query;

    if (mode && mode !== "all") {
      hackathons = hackathons.filter(
        (h) => h.mode?.toLowerCase() === mode.toLowerCase()
      );
    }

    if (location && location !== "all") {
      const loc = location.toLowerCase();
      hackathons = hackathons.filter(
        (h) =>
          h.location?.toLowerCase().includes(loc) ||
          h.location?.toLowerCase() === "online" ||
          h.location?.toLowerCase().includes("pan india") ||
          h.location?.toLowerCase().includes("india")
      );
    }

    res.json(hackathons);
  } catch (err) {
    console.error("Hackathons route error:", err.message);
    res.status(500).json({ error: "Failed to fetch hackathons" });
  }
});

export default router;

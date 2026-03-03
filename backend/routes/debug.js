import express from "express";
import axios from "axios";

const router = express.Router();

// GET /api/debug/unstop-jobs - shows raw API response
router.get("/unstop-jobs", async (req, res) => {
  try {
    const { data } = await axios.get(
      "https://unstop.com/api/public/opportunity/search-result",
      {
        params: { opportunity: "jobs", per_page: 3, oppstatus: "recent" },
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36",
          "Accept": "application/json, text/plain, */*",
          "Referer": "https://unstop.com/jobs",
          "Origin": "https://unstop.com",
        },
        timeout: 10000,
      }
    );

    const items = data?.data?.data || [];
    // Return the raw first item so we can see ALL fields
    res.json({
      total: items.length,
      first_item_all_fields: items[0] || null,
      url_related_fields: items.map((j) => ({
        id: j.id,
        title: j.title,
        public_url: j.public_url,
        seo_url: j.seo_url,
        url: j.url,
        slug: j.slug,
        opportunity_type: j.opportunity_type,
        // show ALL keys
        all_keys: Object.keys(j),
      })),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/unstop-hackathons", async (req, res) => {
  try {
    const { data } = await axios.get(
      "https://unstop.com/api/public/opportunity/search-result",
      {
        params: { opportunity: "hackathons", per_page: 3, oppstatus: "recent" },
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36",
          "Accept": "application/json, text/plain, */*",
          "Referer": "https://unstop.com/hackathons",
          "Origin": "https://unstop.com",
        },
        timeout: 10000,
      }
    );

    const items = data?.data?.data || [];
    res.json({
      total: items.length,
      first_item_all_fields: items[0] || null,
      url_related_fields: items.map((h) => ({
        id: h.id,
        title: h.title,
        public_url: h.public_url,
        seo_url: h.seo_url,
        url: h.url,
        slug: h.slug,
        city: h.city,
        event_mode: h.event_mode,
        college_level: h.college_level,
        all_keys: Object.keys(h),
      })),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;

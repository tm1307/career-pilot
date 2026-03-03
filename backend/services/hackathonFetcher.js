import axios from "axios";

const CACHE_TTL = 12 * 60 * 1000;
const cache = { data: null, ts: 0 };

function stripHtml(str) {
  if (!str) return null;
  const s = String(str).replace(/<[^>]*>/g, "").replace(/&amp;/g, "&").trim();
  return (s === "0" || s === "$0" || s === "₹0" || s === "") ? null : s;
}

// Unstop public_url already contains the full path ("hackathons/title-org-123")
// NEVER add /hackathons/ yourself — only prepend the domain
function unstopUrl(h) {
  if (h.public_url) return `https://unstop.com/${h.public_url}`;
  if (h.seo_url)    return `https://unstop.com/${h.seo_url}`;
  return `https://unstop.com/hackathons/${h.id}`;
}

// Canonical city names — maps every known alias Unstop might return
const CITY_CANON = {
  // Delhi variants
  "new delhi": "Delhi", "delhi ncr": "Delhi", "ncr": "Delhi",
  "new delhi ncr": "Delhi", "delhi/ncr": "Delhi",
  // Bangalore variants
  "bengaluru": "Bangalore", "bangaluru": "Bangalore",
  "bangalore urban": "Bangalore", "bengaluru urban": "Bangalore",
  // Mumbai variants
  "bombay": "Mumbai", "navi mumbai": "Mumbai", "mumbai city": "Mumbai",
  // Others
  "secunderabad": "Hyderabad", "madras": "Chennai", "calcutta": "Kolkata",
};

function canonCity(raw) {
  if (!raw) return null;
  const lo = raw.trim().toLowerCase();
  return CITY_CANON[lo] || raw.trim();
}

function getLocation(h) {
  // Try every field Unstop might use for city
  const candidates = [
    h.city,
    h.cities?.[0]?.name,
    h.location,
    h.venue_city,
  ];
  for (const c of candidates) {
    const canon = canonCity(c);
    if (canon && canon !== "India" && canon !== "") return canon;
  }
  // Fallback from level
  if (h.college_level === "National" || h.college_level === "International") return "Pan India";
  return "India";
}

// ── Unstop: fetch both general + city-targeted results ───────────────────────
async function fetchUnstop() {
  const INDIAN_CITIES = ["Delhi", "Bangalore", "Mumbai", "Hyderabad", "Chennai", "Pune", "Kolkata"];
  
  const commonHeaders = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124.0.0.0 Safari/537.36",
    "Accept":     "application/json, text/plain, */*",
    "Referer":    "https://unstop.com/hackathons",
    "Origin":     "https://unstop.com",
  };

  // Fetch general (recent, 100 results)
  let general = [];
  try {
    const { data } = await axios.get(
      "https://unstop.com/api/public/opportunity/search-result",
      {
        params: { opportunity: "hackathons", per_page: 100, oppstatus: "recent" },
        headers: commonHeaders,
        timeout: 12000,
      }
    );
    general = data?.data?.data || [];
  } catch (err) {
    console.warn("Unstop general:", err.message);
  }

  // Also fetch with city search to find city-specific hackathons
  let cityResults = [];
  try {
    const { data } = await axios.get(
      "https://unstop.com/api/public/opportunity/search-result",
      {
        params: { opportunity: "hackathons", per_page: 100, oppstatus: "recent", type: "offline" },
        headers: commonHeaders,
        timeout: 12000,
      }
    );
    cityResults = data?.data?.data || [];
  } catch (err) {
    console.warn("Unstop offline:", err.message);
  }

  // Merge, deduplicate by id
  const allItems = [...general, ...cityResults];
  const seen = new Set();
  const unique = allItems.filter((h) => {
    if (seen.has(h.id)) return false;
    seen.add(h.id);
    return true;
  });

  return unique.map((h) => ({
    id:        `unstop-${h.id}`,
    title:     h.title,
    organizer: h.organisation?.name || "Unknown",
    location:  getLocation(h),
    mode:      h.event_mode?.toLowerCase() === "online" ? "Online" : "Offline",
    startDate: h.start_date,
    endDate:   h.end_date,
    url:       unstopUrl(h),
    prizes:    stripHtml(h.prizes?.[0]?.amount ? `₹${h.prizes[0].amount}` : null),
    tags:      (h.skills || []).map((s) => s.name || s),
    source:    "Unstop",
    // keep raw for debugging
    _rawCity:  h.city || h.cities?.[0]?.name || null,
  }));
}

// ── Dare2Compete ─────────────────────────────────────────────────────────────
async function fetchD2C() {
  try {
    const { data } = await axios.get(
      "https://dare2compete.com/api/v1/opportunities",
      {
        params: { type: "hackathon", status: "active", limit: 30 },
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          "Accept": "application/json",
          "Referer": "https://dare2compete.com/hackathon",
        },
        timeout: 10000,
      }
    );
    const items = data?.data || data?.opportunities || [];
    return items.map((h) => ({
      id:        `d2c-${h.id || h.slug}`,
      title:     h.title || h.name,
      organizer: h.organization?.name || h.organizer || "Dare2Compete",
      location:  canonCity(h.city) || canonCity(h.location) || "India",
      mode:      (h.mode?.toLowerCase() === "online" || h.is_online) ? "Online" : "Offline",
      startDate: h.start_date || h.registration_end,
      endDate:   h.end_date,
      url:       h.url || `https://dare2compete.com/${h.slug || h.id}`,
      prizes:    h.prize_amount ? `₹${h.prize_amount}` : null,
      tags:      (h.tags || h.skills || []).map((t) => t.name || t),
      source:    "D2C",
    }));
  } catch (err) {
    console.warn("Dare2Compete:", err.message);
    return [];
  }
}

// ── Devpost ──────────────────────────────────────────────────────────────────
async function fetchDevpost() {
  try {
    const { data } = await axios.get("https://devpost.com/api/hackathons", {
      params: { status: "upcoming", order_by: "deadline", per_page: 24 },
      headers: { "User-Agent": "Mozilla/5.0", "Accept": "application/json" },
      timeout: 8000,
    });
    return (data?.hackathons || []).map((h) => ({
      id:        `devpost-${h.id}`,
      title:     h.title,
      organizer: h.organization_name || "Devpost",
      location:  h.location || (h.online ? "Online" : "Various"),
      mode:      h.online ? "Online" : "Offline",
      startDate: h.submission_period_dates?.split("–")[0]?.trim(),
      endDate:   h.submission_period_dates?.split("–")[1]?.trim(),
      url:       h.url,
      prizes:    stripHtml(h.prize_amount),
      tags:      (h.themes || []).map((t) => t.name),
      source:    "Devpost",
    }));
  } catch (err) {
    console.warn("Devpost:", err.message);
    return [];
  }
}

// ── MLH ──────────────────────────────────────────────────────────────────────
async function fetchMLH() {
  try {
    const { data } = await axios.get("https://mlh.io/seasons/2025/events", {
      headers: { "User-Agent": "Mozilla/5.0", Accept: "text/html" },
      timeout: 8000,
    });
    const { load } = await import("cheerio");
    const $ = load(data);
    const results = [];
    $(".event.feature, .event-wrapper").each((_, el) => {
      const title    = $(el).find(".event-name, h3").first().text().trim();
      const date     = $(el).find(".event-date").text().trim();
      const location = $(el).find(".event-location").text().trim();
      const url      = $(el).find("a").attr("href") || "https://mlh.io";
      if (!title) return;
      results.push({
        id:        `mlh-${title.toLowerCase().replace(/\s+/g, "-").slice(0, 40)}`,
        title,     organizer: "MLH",
        location:  location || "Online",
        mode:      (!location || location.toLowerCase().includes("online")) ? "Online" : "Offline",
        startDate: date, endDate: null, url, prizes: null, tags: [], source: "MLH",
      });
    });
    return results.slice(0, 20);
  } catch (err) {
    console.warn("MLH:", err.message);
    return [];
  }
}

// ── main ─────────────────────────────────────────────────────────────────────
export async function fetchHackathons() {
  if (cache.data && Date.now() - cache.ts < CACHE_TTL) return cache.data;

  const [unstop, d2c, devpost, mlh] = await Promise.all([
    fetchUnstop(), fetchD2C(), fetchDevpost(), fetchMLH(),
  ]);

  const all = [...unstop, ...d2c, ...devpost, ...mlh];
  cache.data = all;
  cache.ts   = Date.now();
  
  // Log location distribution to help debug
  const locCounts = {};
  all.forEach((h) => { locCounts[h.location] = (locCounts[h.location] || 0) + 1; });
  console.log(`Hackathons — unstop:${unstop.length} d2c:${d2c.length} devpost:${devpost.length} mlh:${mlh.length}`);
  console.log("Location distribution:", JSON.stringify(locCounts));

  return all;
}

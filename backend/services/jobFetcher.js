import axios from "axios";

const CACHE_TTL = 10 * 60 * 1000;
const cache = { data: null, ts: 0 };

// Unstop public_url already has the path prefix e.g. "jobs/title-company-123"
function unstopJobUrl(j) {
  if (j.public_url) return `https://unstop.com/${j.public_url}`;
  if (j.seo_url)    return `https://unstop.com/${j.seo_url}`;
  return `https://unstop.com/jobs/${j.id}`;
}

// Remotive — remote jobs, wider net (no keyword filter, just take top 40)
async function fetchRemote() {
  try {
    const { data } = await axios.get("https://remotive.com/api/remote-jobs", { timeout: 8000 });
    // Sort: entry-level keywords first, but include everything
    const ENTRY = ["intern", "junior", "graduate", "trainee", "entry", "associate", "fresh"];
    const jobs = data.jobs || [];
    const ranked = jobs
      .map((j) => ({ j, score: ENTRY.some((k) => j.title.toLowerCase().includes(k)) ? 1 : 0 }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 40)
      .map(({ j }) => ({
        id:       `remotive-${j.id}`,
        title:    j.title,
        company:  j.company_name,
        location: j.candidate_required_location || "Remote",
        type:     j.job_type || "full_time",
        url:      j.url,
        tags:     j.tags || [],
        source:   "Remote",
        postedAt: j.publication_date,
      }));
    return ranked;
  } catch (err) {
    console.warn("Remotive:", err.message);
    return [];
  }
}

// Adzuna India — requires free API key
async function fetchAdzuna() {
  const appId = process.env.ADZUNA_APP_ID, apiKey = process.env.ADZUNA_API_KEY;
  if (!appId || appId === "your_adzuna_app_id") return [];
  try {
    const { data } = await axios.get("https://api.adzuna.com/v1/api/jobs/in/search/1", {
      params: { app_id: appId, app_key: apiKey, results_per_page: 20, what: "software intern junior developer" },
      timeout: 8000,
    });
    return (data.results || []).map((j) => ({
      id:       `adzuna-${j.id}`,
      title:    j.title,
      company:  j.company?.display_name || "Unknown",
      location: j.location?.display_name || "India",
      type:     "full_time",
      url:      j.redirect_url,
      tags:     [],
      source:   "India",
      postedAt: j.created,
    }));
  } catch (err) {
    console.warn("Adzuna:", err.message);
    return [];
  }
}

// Unstop jobs
async function fetchUnstop() {
  try {
    const { data } = await axios.get(
      "https://unstop.com/api/public/opportunity/search-result",
      {
        params: { opportunity: "jobs", per_page: 40, oppstatus: "recent" },
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124.0.0.0 Safari/537.36",
          "Accept": "application/json, text/plain, */*",
          "Referer": "https://unstop.com/jobs",
          "Origin": "https://unstop.com",
        },
        timeout: 10000,
      }
    );
    return (data?.data?.data || []).map((j) => ({
      id:       `unstop-${j.id}`,
      title:    j.title,
      company:  j.organisation?.name || "Unknown",
      location: j.city?.trim() || "India",
      type:     j.job_type || "full_time",
      url:      unstopJobUrl(j),
      tags:     (j.skills || []).map((s) => s.name || s),
      source:   "Unstop",
      postedAt: j.start_date,
    }));
  } catch (err) {
    console.warn("Unstop jobs:", err.message);
    return [];
  }
}

export async function fetchAllJobs() {
  if (cache.data && Date.now() - cache.ts < CACHE_TTL) return cache.data;
  const [remote, india, unstop] = await Promise.all([fetchRemote(), fetchAdzuna(), fetchUnstop()]);
  const all = [...remote, ...india, ...unstop];
  cache.data = all; cache.ts = Date.now();
  console.log(`Jobs — remote:${remote.length} india:${india.length} unstop:${unstop.length}`);
  return all;
}

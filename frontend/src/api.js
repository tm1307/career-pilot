const BASE = (import.meta.env.VITE_API_URL || "http://localhost:5001") + "/api";
const getToken = () => localStorage.getItem("cp_token");

async function request(path, options = {}) {
  const token = getToken();
  const headers = { ...options.headers };
  if (token) headers.Authorization = `Bearer ${token}`;
  let res;
  try { res = await fetch(`${BASE}${path}`, { ...options, headers }); }
  catch { throw new Error("Cannot reach server — is the backend running?"); }
  let body;
  try { body = await res.json(); } catch { throw new Error(`Server error (${res.status})`); }
  if (!res.ok) throw new Error(body?.error || `Request failed (${res.status})`);
  return body;
}
const json = (d) => ({ headers: { "Content-Type": "application/json" }, body: JSON.stringify(d) });

export const register      = (d) => request("/auth/register", { method: "POST",  ...json(d) });
export const login         = (d) => request("/auth/login",    { method: "POST",  ...json(d) });
export const getMe         = ()  => request("/auth/me");
export const updateProfile = (d) => request("/auth/profile",  { method: "PATCH", ...json(d) });

export async function checkResume(formData) {
  const token = getToken();
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  let res;
  try { res = await fetch(`${BASE}/resume/check`, { method: "POST", headers, body: formData }); }
  catch { throw new Error("Cannot reach server"); }
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body?.error || "Resume check failed");
  return body;
}

export const fetchJobs = (p = {}) => request(`/jobs?${new URLSearchParams(p)}`);
export const fetchHackathons = (p = {}) => request(`/hackathons?${new URLSearchParams(p)}`);
export const getGuidance  = (prompt) => request("/guide",           { method: "POST", ...json({ prompt }) });
export const getPlanner   = (d)      => request("/planner",         { method: "POST", ...json(d) });
export const buildResume  = (d)      => request("/builder/generate",{ method: "POST", ...json(d) });

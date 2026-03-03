import React, { useEffect, useState } from "react";
import { fetchJobs } from "../api.js";

const SOURCES = ["All", "Remote", "India", "Unstop"];

function JobCard({ job, saved, onToggle }) {
  return (
    <div className={`job-card ${saved ? "saved" : ""}`}>
      <div className="jcard-top">
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="jt">{job.title}</div>
          <div className="jc">{job.company}</div>
        </div>
        <button className={`btn-save ${saved ? "saved" : ""}`} onClick={() => onToggle(job)} title={saved ? "Unsave" : "Save"}>
          {saved ? "🔖" : "🤍"}
        </button>
      </div>

      <div className="jmeta">
        <span>📍 {job.location}</span>
        {job.type && <span>🕐 {job.type.replace("_", " ")}</span>}
        <span className={`sbadge s-${job.source}`}>{job.source}</span>
      </div>

      {job.tags?.length > 0 && (
        <div className="jtags">
          {job.tags.slice(0, 4).map((t) => <span key={t} className="jtag">{t}</span>)}
        </div>
      )}

      <a className="jlink" href={job.url} target="_blank" rel="noreferrer">View listing →</a>
    </div>
  );
}

export default function Opportunities() {
  const [jobs, setJobs]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");
  const [source, setSource]   = useState("All");
  const [search, setSearch]   = useState("");
  const [tab, setTab]         = useState("browse"); // "browse" | "saved"
  const [saved, setSaved]     = useState(() => {
    try { return JSON.parse(localStorage.getItem("cp_saved_jobs") || "[]"); } catch { return []; }
  });

  useEffect(() => {
    fetchJobs()
      .then(setJobs)
      .catch(() => setError("Failed to load jobs — please try again"))
      .finally(() => setLoading(false));
  }, []);

  function toggleSave(job) {
    const next = saved.some((j) => j.id === job.id)
      ? saved.filter((j) => j.id !== job.id)
      : [...saved, job];
    setSaved(next);
    localStorage.setItem("cp_saved_jobs", JSON.stringify(next));
  }

  const base = tab === "saved" ? saved : jobs;
  const filtered = base.filter((j) => {
    const matchSource = source === "All" || j.source === source;
    const matchSearch = !search ||
      j.title?.toLowerCase().includes(search.toLowerCase()) ||
      j.company?.toLowerCase().includes(search.toLowerCase()) ||
      j.tags?.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    return matchSource && matchSearch;
  });

  return (
    <div>
      <div className="card">
        <div className="toolbar">
          {/* Browse / Saved tabs */}
          <button className={`pill ${tab === "browse" ? "on" : ""}`} onClick={() => setTab("browse")}>
            Browse <span className="pill-count">{jobs.length}</span>
          </button>
          <button className={`pill ${tab === "saved" ? "on" : ""}`} onClick={() => setTab("saved")}>
            Saved {saved.length > 0 && <span className="pill-count">{saved.length}</span>}
          </button>

          {/* Source filter */}
          <div style={{ display: "flex", gap: "4px", marginLeft: "auto" }}>
            {SOURCES.map((s) => (
              <button key={s} className={`pill ${source === s ? "on" : ""}`} onClick={() => setSource(s)}>
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Search */}
        <div className="search-wrap">
          <input type="text" placeholder="🔍  Search by title, company or skill…" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>

      {loading && <div className="loader"><div className="dots"><span/><span/><span/></div>Fetching opportunities…</div>}
      {error   && <div className="err">⚠ {error}</div>}

      {!loading && !error && (
        <>
          <div className="count-ln" style={{ marginTop: "0.875rem" }}>{filtered.length} results</div>
          {filtered.length === 0 ? (
            <div className="empty">
              <div className="empty-icon">{tab === "saved" ? "🔖" : "🔍"}</div>
              <p>{tab === "saved" ? "No saved jobs yet." : "No jobs match your filters."}</p>
            </div>
          ) : (
            <div className="jgrid">
              {filtered.map((j) => (
                <JobCard key={j.id} job={j} saved={saved.some((s) => s.id === j.id)} onToggle={toggleSave} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

import React, { useEffect, useState } from "react";
import { fetchHackathons } from "../api.js";

const MODES   = ["All", "Online", "Offline"];
const SOURCES = ["All", "Unstop", "D2C", "Devpost", "MLH"];

function fmt(d) {
  if (!d) return null;
  try { return new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short" }); }
  catch { return d; }
}

function HCard({ h }) {
  return (
    <div className="hcard">
      <div className="ht">{h.title}</div>
      <div className="ho">{h.organizer}</div>
      <div className="hmeta">
        <span>📍 {h.location}</span>
        {fmt(h.startDate) && <span>📅 {fmt(h.startDate)}</span>}
        <span className={`mbadge m-${h.mode}`}>{h.mode}</span>
        <span className={`sbadge s-${h.source}`}>{h.source}</span>
      </div>
      {h.prizes && <div className="hprize">🏆 {h.prizes}</div>}
      {h.tags?.length > 0 && (
        <div className="jtags" style={{ marginTop: "0.3rem" }}>
          {h.tags.slice(0, 4).map((t) => <span key={t} className="jtag">{t}</span>)}
        </div>
      )}
      <a className="hlink" href={h.url} target="_blank" rel="noreferrer">Register →</a>
    </div>
  );
}

export default function Hackathons() {
  const [all, setAll]       = useState([]);
  const [loading, setLoad]  = useState(true);
  const [error, setError]   = useState("");
  const [mode, setMode]     = useState("All");
  const [source, setSrc]    = useState("All");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchHackathons()
      .then(setAll)
      .catch(() => setError("Could not load hackathons — check your connection"))
      .finally(() => setLoad(false));
  }, []);

  const filtered = all.filter((h) => {
    if (mode !== "All" && h.mode !== mode) return false;
    if (source !== "All" && h.source !== source) return false;
    if (search) {
      const q = search.toLowerCase();
      if (
        !h.title?.toLowerCase().includes(q) &&
        !h.organizer?.toLowerCase().includes(q) &&
        !h.location?.toLowerCase().includes(q) &&
        !h.tags?.some((t) => t.toLowerCase().includes(q))
      ) return false;
    }
    return true;
  });

  const count = (f) => all.filter(f).length;

  return (
    <div>
      <div className="card">
        <div className="toolbar">
          {MODES.map((m) => (
            <button key={m} className={`pill ${mode === m ? "on" : ""}`} onClick={() => setMode(m)}>
              {m}
              <span className="pill-n">{count((h) => m === "All" || h.mode === m)}</span>
            </button>
          ))}
          <div style={{ width: 1, height: 18, background: "var(--border)", margin: "0 0.1rem" }} />
          {SOURCES.map((s) => (
            <button key={s} className={`pill ${source === s ? "on" : ""}`} onClick={() => setSrc(s)}>
              {s}
              <span className="pill-n">{count((h) => s === "All" || h.source === s)}</span>
            </button>
          ))}
        </div>
        <input
          type="text"
          placeholder="Search by name, organizer, location or skill…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading && (
        <div className="loader">
          <div className="dots"><span /><span /><span /></div>
          Loading from Unstop, D2C, Devpost & MLH…
        </div>
      )}
      {error && <div className="err" style={{ marginTop: "0.875rem" }}>⚠ {error}</div>}

      {!loading && !error && (
        <>
          <div className="count-ln" style={{ marginTop: "0.875rem" }}>
            {filtered.length} hackathon{filtered.length !== 1 ? "s" : ""}
            {mode !== "All" && ` · ${mode}`}
            {source !== "All" && ` · ${source}`}
            {search && ` · "${search}"`}
          </div>
          {filtered.length === 0 ? (
            <div className="empty">
              <div className="empty-ico">🏆</div>
              <p>No hackathons match your filters.{'\n'}Try clearing the search or switching to All.</p>
            </div>
          ) : (
            <div className="hgrid">
              {filtered.map((h) => <HCard key={h.id} h={h} />)}
            </div>
          )}
        </>
      )}
    </div>
  );
}

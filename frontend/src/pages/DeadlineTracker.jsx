import React, { useState, useEffect } from "react";

const STORE_KEY = "cp_deadlines";

function load() {
  try { return JSON.parse(localStorage.getItem(STORE_KEY) || "[]"); }
  catch { return []; }
}
function save(items) {
  localStorage.setItem(STORE_KEY, JSON.stringify(items));
}

function daysLeft(dateStr) {
  if (!dateStr) return null;
  const diff = new Date(dateStr) - new Date();
  return Math.ceil(diff / 86400000);
}

function urgency(n) {
  if (n === null) return "none";
  if (n < 0) return "none";
  if (n <= 3) return "urgent";
  if (n <= 7) return "soon";
  return "fine";
}

function fmt(dateStr) {
  if (!dateStr) return "No deadline";
  try { return new Date(dateStr).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }); }
  catch { return dateStr; }
}

function barWidth(dateStr, addedAt) {
  if (!dateStr || !addedAt) return 100;
  const total = new Date(dateStr) - new Date(addedAt);
  const left  = new Date(dateStr) - new Date();
  if (total <= 0) return 0;
  return Math.max(0, Math.min(100, (left / total) * 100));
}

const EMPTY_FORM = { title: "", org: "", type: "job", deadline: "", url: "" };

export default function DeadlineTracker() {
  const [items, setItems]   = useState(load);
  const [form, setForm]     = useState(EMPTY_FORM);
  const [adding, setAdding] = useState(false);
  const [err, setErr]       = useState("");

  useEffect(() => { save(items); }, [items]);

  function change(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setErr("");
  }

  function add(e) {
    e.preventDefault();
    if (!form.title.trim()) return setErr("Title is required");
    const item = { ...form, id: Date.now(), addedAt: new Date().toISOString() };
    setItems((p) => [item, ...p]);
    setForm(EMPTY_FORM);
    setAdding(false);
  }

  function remove(id) {
    setItems((p) => p.filter((i) => i.id !== id));
  }

  const sorted = [...items].sort((a, b) => {
    const da = a.deadline ? new Date(a.deadline) : new Date("2099-01-01");
    const db = b.deadline ? new Date(b.deadline) : new Date("2099-01-01");
    return da - db;
  });

  return (
    <div>
      {/* Header row */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.875rem" }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--text)" }}>Deadline Tracker</div>
          <div style={{ fontSize: "0.68rem", color: "var(--text3)", marginTop: "0.1rem" }}>
            {items.length} item{items.length !== 1 ? "s" : ""} tracked
          </div>
        </div>
        <button className="btn btn-sm" onClick={() => setAdding((v) => !v)}>
          {adding ? "Cancel" : "+ Add item"}
        </button>
      </div>

      {/* Add form */}
      {adding && (
        <div className="card" style={{ marginBottom: "0.875rem", animation: "fadeUp 0.18s ease" }}>
          <div style={{ fontWeight: 600, fontSize: "0.82rem", marginBottom: "0.75rem" }}>Track a new deadline</div>
          <div className="two-col">
            <div className="field">
              <label>Title</label>
              <input name="title" placeholder="SDE Intern @ Google" value={form.title} onChange={change} autoFocus />
            </div>
            <div className="field">
              <label>Company / Organiser</label>
              <input name="org" placeholder="Google" value={form.org} onChange={change} />
            </div>
          </div>
          <div className="two-col">
            <div className="field">
              <label>Type</label>
              <select name="type" value={form.type} onChange={change}>
                <option value="job">Job / Internship</option>
                <option value="hack">Hackathon</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="field">
              <label>Deadline</label>
              <input name="deadline" type="date" value={form.deadline} onChange={change} />
            </div>
          </div>
          <div className="field">
            <label>Link (optional)</label>
            <input name="url" type="url" placeholder="https://…" value={form.url} onChange={change} />
          </div>
          {err && <div className="err">{err}</div>}
          <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.25rem" }}>
            <button className="btn btn-sm" onClick={add}>Save</button>
            <button className="btn btn-sm btn-ghost" onClick={() => setAdding(false)}>Cancel</button>
          </div>
        </div>
      )}

      {/* Hint */}
      {items.length === 0 && !adding && (
        <div className="card" style={{ textAlign: "center", padding: "3rem 1.5rem" }}>
          <div style={{ fontSize: "2.5rem", marginBottom: "0.65rem", opacity: 0.45 }}>📅</div>
          <div style={{ fontWeight: 600, marginBottom: "0.4rem", color: "var(--text)" }}>No deadlines tracked yet</div>
          <p style={{ fontSize: "0.82rem", color: "var(--text3)", maxWidth: 320, margin: "0 auto 1.25rem", lineHeight: 1.65 }}>
            Add jobs or hackathons you want to apply to and never miss a deadline.
            The countdown bar turns red as the date gets close.
          </p>
          <button className="btn btn-sm" onClick={() => setAdding(true)}>+ Track your first deadline</button>
        </div>
      )}

      {/* Cards */}
      {sorted.length > 0 && (
        <div className="tracker-grid">
          {sorted.map((item) => {
            const days = daysLeft(item.deadline);
            const urg  = urgency(days);
            const bw   = barWidth(item.deadline, item.addedAt);
            const expired = days !== null && days < 0;

            return (
              <div key={item.id} className="tracker-card">
                <div className={`tc-type ${item.type === "hack" ? "hack" : "job"}`}>
                  {item.type === "job" ? "Job / Internship" : item.type === "hack" ? "Hackathon" : "Other"}
                </div>
                <div className="tc-title">
                  {item.url
                    ? <a href={item.url} target="_blank" rel="noreferrer" style={{ color: "inherit", textDecoration: "none" }}>{item.title}</a>
                    : item.title}
                </div>
                {item.org && <div className="tc-org">{item.org}</div>}
                <div className="tc-bottom">
                  <div className={`tc-days ${urg}`}>
                    {expired
                      ? "Expired"
                      : days === null
                        ? "No deadline"
                        : days === 0
                          ? "Due today"
                          : `${days}d left`}
                  </div>
                  <div className="tc-date">{fmt(item.deadline)}</div>
                </div>
                <button className="tc-remove" onClick={() => remove(item.id)} title="Remove">✕</button>
                {item.deadline && !expired && (
                  <div className="tc-bar" style={{ width: `${bw}%` }} />
                )}
              </div>
            );
          })}
        </div>
      )}

      {items.length > 0 && (
        <div className="tracker-hint" style={{ marginTop: "0.875rem" }}>
          <strong>🟢 Green</strong> = 8+ days left &nbsp;·&nbsp;
          <strong>🟡 Yellow</strong> = 4–7 days &nbsp;·&nbsp;
          <strong>🔴 Red</strong> = 1–3 days &nbsp;·&nbsp;
          Data saved in your browser.
        </div>
      )}
    </div>
  );
}

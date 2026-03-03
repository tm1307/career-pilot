import React, { useState } from "react";
import { getPlanner } from "../api.js";
import { useAuth } from "../context/AuthContext.jsx";

const TIMELINES = [
  { value: "1 month",  label: "1 Month — Crash Course" },
  { value: "3 months", label: "3 Months — Standard" },
  { value: "6 months", label: "6 Months — Deep Dive" },
];

export default function Planner({ onAuth }) {
  const { user }              = useAuth();
  const [form, setForm]       = useState({ level: "Beginner", goal: "", skills: "", timeline: "3 months" });
  const [roadmap, setRoadmap] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  function change(e) { setForm((f) => ({ ...f, [e.target.name]: e.target.value })); }

  async function generate() {
    if (!user) { onAuth(); return; }
    if (!form.goal.trim()) { setError("Please enter your target role"); return; }
    setLoading(true); setRoadmap([]); setError("");
    try {
      const data = await getPlanner(form);
      setRoadmap(data.roadmap || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="plan-wrap">
      {/* Form */}
      <div className="card">
        <div className="section-title">🗺️ Build My Roadmap</div>

        <div className="field">
          <label>Current Level</label>
          <select name="level" value={form.level} onChange={change}>
            <option value="Beginner">Beginner (Student)</option>
            <option value="Intermediate">Intermediate (Projects done)</option>
            <option value="Advanced">Advanced (Job ready)</option>
          </select>
        </div>

        <div className="field">
          <label>Target Role</label>
          <input name="goal" value={form.goal} onChange={change} placeholder="e.g. Google SDE Intern" />
        </div>

        <div className="field">
          <label>Current Skills</label>
          <input name="skills" value={form.skills} onChange={change} placeholder="e.g. Python, basic HTML" />
        </div>

        <div className="field">
          <label>Timeline</label>
          <select name="timeline" value={form.timeline} onChange={change}>
            {TIMELINES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
        </div>

        <button className="btn btn-full" onClick={generate} disabled={loading}>
          {!user ? "🔒 Sign In to Generate" : loading ? "Generating…" : "Create My Roadmap →"}
        </button>

        {!user && (
          <div className="gate-banner">
            <span>✨ Free account needed for AI roadmaps.</span>
            <button className="btn-gate" onClick={onAuth}>Sign in →</button>
          </div>
        )}

        {error && <div className="err">{error}</div>}
      </div>

      {/* Result */}
      <div>
        {loading && (
          <div className="loader" style={{ padding: "2rem" }}>
            <div className="dots"><span/><span/><span/></div>
            Building your personalized roadmap…
          </div>
        )}

        {!loading && roadmap.length === 0 && (
          <div className="empty card">
            <div className="empty-icon">🗺️</div>
            <p>Fill in the form and click <strong>Create My Roadmap</strong> to get started.</p>
          </div>
        )}

        {roadmap.length > 0 && (
          <div className="tl">
            {roadmap.map((step, i) => (
              <div key={i} className="tl-step card" style={{ animationDelay: `${i * 0.05}s` }}>
                <div className="tl-head">
                  <span className="tl-badge">{step.week || `Step ${i + 1}`}</span>
                  <div className="tl-topic">{step.topic}</div>
                </div>
                {step.action_items?.length > 0 && (
                  <ul className="tl-acts">
                    {step.action_items.map((item, j) => <li key={j}>{item}</li>)}
                  </ul>
                )}
                {step.resources && <div className="tl-res">📚 {step.resources}</div>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

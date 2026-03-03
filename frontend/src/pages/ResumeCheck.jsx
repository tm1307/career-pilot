import React, { useState } from "react";
import { checkResume } from "../api.js";
import { useAuth } from "../context/AuthContext.jsx";

function ScoreRing({ score }) {
  const r = 40, circ = 2 * Math.PI * r;
  const fill = (Math.min(100, score) / 100) * circ;
  const color = score >= 75 ? "#3fb950" : score >= 50 ? "#d29922" : "#f85149";
  const cls   = score >= 75 ? "c-good"  : score >= 50 ? "c-med"   : "c-bad";
  return (
    <div className="score-ring">
      <svg width={96} height={96} viewBox="0 0 96 96">
        <circle cx={48} cy={48} r={r} fill="none" stroke="#30363d" strokeWidth={7} />
        <circle cx={48} cy={48} r={r} fill="none" stroke={color} strokeWidth={7}
          strokeLinecap="round" strokeDasharray={`${fill} ${circ}`}
          style={{ transition: "stroke-dasharray 0.9s ease" }} />
      </svg>
      <div className="score-c">
        <span className={`score-num ${cls}`}>{score}</span>
        <span className="score-l">ATS</span>
      </div>
    </div>
  );
}

export default function ResumeCheck({ onAuth }) {
  const { user }            = useAuth();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState("");
  const [drag, setDrag]     = useState(false);

  async function handleFile(file) {
    if (!file || !file.name.endsWith(".pdf")) { setError("Please upload a PDF file"); return; }
    setLoading(true); setError(""); setResult(null);
    try {
      const fd = new FormData();
      fd.append("resume", file);
      setResult(await checkResume(fd));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (!user) {
    return (
      <div className="gate-card">
        <div className="gate-icon">📄</div>
        <div className="gate-title">ATS Resume Analyzer</div>
        <p className="gate-desc">Upload your resume to get an instant ATS score, detect missing skills, and receive actionable suggestions.</p>
        <button className="btn" onClick={onAuth}>Sign in to analyze →</button>
        <p className="gate-sub">Free · No credit card required</p>
      </div>
    );
  }

  return (
    <div>
      <div className="card">
        <div className="section-title">📄 ATS Resume Analyzer</div>
        <p style={{ fontSize: "0.85rem", color: "var(--text2)", marginBottom: "1.25rem" }}>
          Upload a text-based PDF to get scored, see matched skills, and get specific improvement tips.
        </p>

        <div
          className={`drop-zone ${drag ? "over" : ""}`}
          onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
          onDragLeave={() => setDrag(false)}
          onDrop={(e) => { e.preventDefault(); setDrag(false); handleFile(e.dataTransfer.files[0]); }}
        >
          <input type="file" accept=".pdf" onChange={(e) => handleFile(e.target.files[0])} />
          <div className="drop-ico">{loading ? "⏳" : "📤"}</div>
          <div className="drop-lbl">{loading ? "Analyzing…" : "Drop PDF here or click to browse"}</div>
          <div className="drop-hint">PDF only · Max 5MB</div>
        </div>

        {loading && <div className="loader"><div className="dots"><span/><span/><span/></div>Running ATS analysis…</div>}
        {error   && <div className="err">⚠ {error}</div>}
      </div>

      {result && (
        <div className="card" style={{ animation: "fadeUp 0.4s ease" }}>
          <div className="ats-grid">
            <ScoreRing score={result.atsScore} />
            <div>
              <div style={{ fontWeight: 600, marginBottom: "0.25rem" }}>
                {result.atsScore >= 75 ? "Strong resume 🎉" : result.atsScore >= 50 ? "Solid base, room to grow" : "Needs improvement"}
              </div>
              <div style={{ fontSize: "0.78rem", color: "var(--text3)", marginBottom: "1rem" }}>
                Confidence: <strong style={{ color: "var(--text2)" }}>{result.confidence}</strong>
              </div>

              {result.matchedSkills?.length > 0 && (
                <>
                  <div className="hlbl">Skills found</div>
                  <div className="stags">
                    {result.matchedSkills.map((s) => <span key={s} className="skill-tag tag-found">✓ {s}</span>)}
                  </div>
                </>
              )}
              {result.missingSkills?.length > 0 && (
                <>
                  <div className="hlbl">Missing skills</div>
                  <div className="stags">
                    {result.missingSkills.slice(0, 8).map((s) => <span key={s} className="skill-tag tag-missing">✗ {s}</span>)}
                  </div>
                </>
              )}
            </div>
          </div>

          {result.suggestions?.length > 0 && (
            <div style={{ marginTop: "1.25rem", paddingTop: "1.25rem", borderTop: "1px solid var(--border)" }}>
              <div className="hlbl">Suggestions</div>
              <ul className="slist">
                {result.suggestions.map((s, i) => <li key={i}>{s}</li>)}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

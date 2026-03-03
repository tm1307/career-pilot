import React, { useState, useRef } from "react";
import { getGuidance } from "../api.js";
import { useAuth } from "../context/AuthContext.jsx";

const QUICK = [
  "How do I become a backend engineer?",
  "Best way to prepare for FAANG interviews?",
  "How to write a cold email to a recruiter?",
  "Top skills for data science in India?",
  "How to negotiate a fresher salary offer?",
];

export default function Guidance({ onAuth }) {
  const { user }                = useAuth();
  const [prompt, setPrompt]     = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const ref                     = useRef(null);

  async function ask(text) {
    const q = text || prompt;
    if (!q.trim()) return;
    if (!user) { onAuth(); return; }
    setLoading(true); setResponse(""); setError("");
    try {
      const data = await getGuidance(q);
      setResponse(data.guidance);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function onKey(e) { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) ask(); }

  return (
    <div className="card" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <div className="section-title">🤖 AI Career Guide</div>
      <p style={{ fontSize: "0.85rem", color: "var(--text2)", marginTop: "-0.5rem" }}>
        Ask anything about career decisions, interviews, job searching, or skill building.
      </p>

      <div className="qprompts">
        {QUICK.map((q) => (
          <button key={q} className="qbtn" onClick={() => { setPrompt(q); ref.current?.focus(); }}>{q}</button>
        ))}
      </div>

      <div className="prow">
        <textarea
          ref={ref}
          placeholder={user ? "Ask anything… (Ctrl+Enter to send)" : "Type a question — sign in to get AI answers"}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={onKey}
        />
        <button className="btn" onClick={() => ask()} disabled={loading || !prompt.trim()} style={{ alignSelf: "flex-end" }}>
          {!user ? "🔒" : loading ? "…" : "Ask →"}
        </button>
      </div>

      {!user && (
        <div className="gate-banner">
          <span>✨ Sign in to get AI-powered answers.</span>
          <button className="btn-gate" onClick={onAuth}>Sign in →</button>
        </div>
      )}

      {loading && <div className="loader"><div className="dots"><span/><span/><span/></div>Thinking…</div>}
      {error   && <div className="err">⚠ {error}</div>}
      {response && <div className="ai-resp">{response}</div>}
    </div>
  );
}

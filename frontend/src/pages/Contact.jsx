import React, { useState } from "react";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  function change(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setError("");
  }

  async function submit(e) {
    e.preventDefault();
    if (!form.name.trim())    return setError("Please enter your name");
    if (!form.email.includes("@")) return setError("Please enter a valid email");
    if (!form.message.trim()) return setError("Please enter a message");

    setBusy(true);
    try {
      // Use mailto as a reliable universal fallback
      // Compose the mailto link and open it — works everywhere, no API key needed
      const subject = encodeURIComponent(`[Career Pilot] ${form.subject || "Contact from " + form.name}`);
      const body    = encodeURIComponent(
        `Name: ${form.name}\nEmail: ${form.email}\n\nMessage:\n${form.message}`
      );
      window.location.href = `mailto:tanvi.001307@gmail.com?subject=${subject}&body=${body}`;
      setSent(true);
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={{ maxWidth: 520, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ marginBottom: "2rem" }}>
        <h2 style={{ fontSize: "1.5rem", fontWeight: 800, letterSpacing: "-0.03em", marginBottom: "0.4rem" }}>
          Contact <span style={{ color: "var(--teal)" }}>Us</span>
        </h2>
        <p style={{ fontSize: "0.845rem", color: "var(--text2)", lineHeight: 1.65 }}>
          Have feedback, found a bug, or want to suggest a feature? We read every message.
        </p>
      </div>

      {/* Quick links row */}
      <div style={{ display: "flex", gap: "0.65rem", marginBottom: "1.75rem", flexWrap: "wrap" }}>
        <a href="https://github.com/tm1307/career-pilot/issues" target="_blank" rel="noreferrer"
          style={{ display: "flex", alignItems: "center", gap: "0.5rem", background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: "var(--r)", padding: "0.55rem 0.875rem", textDecoration: "none", color: "var(--text2)", fontSize: "0.78rem", transition: "border-color 0.13s" }}
          onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(240,165,0,0.3)"}
          onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}
        >
          <span style={{ fontSize: "1rem" }}>🐙</span> GitHub Issues
        </a>
        <a href="mailto:tanvi.001307@gmail.com"
          style={{ display: "flex", alignItems: "center", gap: "0.5rem", background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: "var(--r)", padding: "0.55rem 0.875rem", textDecoration: "none", color: "var(--text2)", fontSize: "0.78rem", transition: "border-color 0.13s" }}
          onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(240,165,0,0.3)"}
          onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}
        >
          <span style={{ fontSize: "1rem" }}>✉️</span> Direct email
        </a>
      </div>

      {/* Contact form */}
      <div className="card">
        {sent ? (
          <div style={{ textAlign: "center", padding: "2rem 0" }}>
            <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>✅</div>
            <div style={{ fontWeight: 700, marginBottom: "0.4rem" }}>Message composed!</div>
            <p style={{ fontSize: "0.82rem", color: "var(--text2)", lineHeight: 1.6 }}>
              Your mail client should have opened. If not, email us directly at{" "}
              <a href="mailto:tanvi.001307@gmail.com" style={{ color: "var(--teal)" }}>tanvi.001307@gmail.com</a>
            </p>
            <button className="btn btn-sm" style={{ marginTop: "1.25rem" }} onClick={() => setSent(false)}>
              Send another message
            </button>
          </div>
        ) : (
          <form onSubmit={submit}>
            <div className="two-col">
              <div className="field">
                <label>Your Name</label>
                <input name="name" type="text" placeholder="Tanvi Mehta" value={form.name} onChange={change} />
              </div>
              <div className="field">
                <label>Email</label>
                <input name="email" type="email" placeholder="tanvi@example.com" value={form.email} onChange={change} />
              </div>
            </div>
            <div className="field">
              <label>Subject <span style={{ color: "var(--text3)", textTransform: "lowercase", letterSpacing: 0, fontSize: "0.6rem" }}>(optional)</span></label>
              <input name="subject" type="text" placeholder="Bug report / Feature request / General feedback" value={form.subject} onChange={change} />
            </div>
            <div className="field">
              <label>Message</label>
              <textarea
                name="message"
                rows={5}
                placeholder="Tell us what's on your mind…"
                value={form.message}
                onChange={change}
              />
            </div>

            {error && <div className="err">⚠ {error}</div>}

            <button type="submit" className="btn btn-full" disabled={busy} style={{ marginTop: "0.5rem" }}>
              {busy ? "Opening mail…" : "Send Message →"}
            </button>

            <p style={{ fontSize: "0.68rem", color: "var(--text3)", textAlign: "center", marginTop: "0.75rem" }}>
              This opens your mail client pre-filled with your message.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}

import React, { useState, useEffect } from "react";
import { login, register } from "../api.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function AuthModal({ onClose }) {
  const { storeSession } = useAuth();
  const [mode, setMode]   = useState("login");
  const [form, setForm]   = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy]   = useState(false);

  // Close on Escape key
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  function change(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setError("");
  }

  function switchMode(m) {
    setMode(m);
    setError("");
    setForm({ name: "", email: "", password: "" });
  }

  async function submit(e) {
    e.preventDefault();

    // Client-side validation
    if (mode === "register") {
      if (!form.name.trim())       return setError("Name is required");
      if (form.password.length < 8) return setError("Password must be at least 8 characters");
    }
    if (!form.email.includes("@")) return setError("Please enter a valid email");

    setBusy(true);
    setError("");

    try {
      const payload =
        mode === "login"
          ? { email: form.email.trim(), password: form.password }
          : { name: form.name.trim(), email: form.email.trim(), password: form.password };

      const { token, user } = await (mode === "login" ? login : register)(payload);
      storeSession(token, user);
      onClose();
    } catch (err) {
      setError(err.message || (mode === "login" ? "Login failed" : "Registration failed"));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="backdrop" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <button className="modal-x" onClick={onClose}>✕</button>

        <div className="modal-icon">✨</div>
        <div className="modal-head">
          {mode === "login" ? "Welcome back" : "Create your account"}
        </div>
        <p className="modal-sub">
          {mode === "login"
            ? "Sign in to access AI-powered features."
            : "Free account — resume tools, roadmaps & AI guidance."}
        </p>

        <div className="tog">
          <button className={`tog-btn ${mode === "login" ? "on" : ""}`} onClick={() => switchMode("login")}>
            Sign In
          </button>
          <button className={`tog-btn ${mode === "register" ? "on" : ""}`} onClick={() => switchMode("register")}>
            Create Account
          </button>
        </div>

        <form onSubmit={submit}>
          {mode === "register" && (
            <div className="field">
              <label>Full Name</label>
              <input name="name" type="text" placeholder="Jane Smith" value={form.name} onChange={change} autoFocus />
            </div>
          )}
          <div className="field">
            <label>Email</label>
            <input name="email" type="email" placeholder="jane@example.com" value={form.email} onChange={change} autoFocus={mode === "login"} />
          </div>
          <div className="field">
            <label>Password</label>
            <input name="password" type="password" placeholder={mode === "register" ? "Min. 8 characters" : "••••••••"} value={form.password} onChange={change} />
          </div>

          {error && <div className="err">⚠ {error}</div>}

          <button type="submit" className="btn-auth" disabled={busy} style={{ marginTop: "0.875rem" }}>
            {busy ? "Please wait…" : mode === "login" ? "Sign In →" : "Create Account →"}
          </button>
        </form>

        <p className="auth-foot">
          {mode === "login" ? "New here? " : "Already have an account? "}
          <span className="lnk" onClick={() => switchMode(mode === "login" ? "register" : "login")}>
            {mode === "login" ? "Create an account" : "Sign in instead"}
          </span>
        </p>

        <p className="guest-n">
          Just browsing?{" "}
          <span className="lnk" onClick={onClose}>Continue as guest</span>
          {" "}— job listings are always free.
        </p>
      </div>
    </div>
  );
}

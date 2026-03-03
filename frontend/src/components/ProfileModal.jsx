import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { updateProfile } from "../api.js";

export default function ProfileModal({ onClose }) {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({ name: "", location: "", currentPassword: "", newPassword: "" });
  const [busy, setBusy]     = useState(false);
  const [error, setError]   = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (user) setForm((f) => ({ ...f, name: user.name || "", location: user.location || "" }));
  }, [user]);

  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  function change(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setError(""); setSuccess("");
  }

  async function save(e) {
    e.preventDefault();
    if (!form.name.trim()) { setError("Name cannot be empty"); return; }
    setBusy(true); setError(""); setSuccess("");
    try {
      const payload = { name: form.name.trim(), location: form.location.trim() };
      if (form.newPassword) {
        payload.currentPassword = form.currentPassword;
        payload.newPassword     = form.newPassword;
      }
      const { user: updated } = await updateProfile(payload);
      updateUser(updated);
      setSuccess("Profile updated successfully!");
      setForm((f) => ({ ...f, currentPassword: "", newPassword: "" }));
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="backdrop" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ maxWidth: 440 }}>
        <button className="modal-x" onClick={onClose}>✕</button>

        <div className="ava-lg">{user?.name?.[0]?.toUpperCase() || "U"}</div>
        <div style={{ fontWeight: 700, fontSize: "1rem", marginBottom: "0.2rem" }}>{user?.name}</div>
        <div style={{ fontSize: "0.78rem", color: "var(--text3)", marginBottom: "1.25rem" }}>{user?.email}</div>

        <form onSubmit={save}>
          <div className="psec">Account Info</div>
          <div className="field">
            <label>Full Name</label>
            <input name="name" value={form.name} onChange={change} placeholder="Jane Smith" />
          </div>
          <div className="field">
            <label>Location (city)</label>
            <input name="location" value={form.location} onChange={change} placeholder="e.g. Bangalore, Delhi, Mumbai" />
          </div>

          <hr className="div" style={{border:"none","borderTop":"1px solid var(--border)","margin":"0.875rem 0"}} />
          <div className="psec">Change Password <span style={{ color: "var(--text3)", fontStyle: "italic", textTransform: "none", letterSpacing: 0 }}>(optional)</span></div>
          <div className="field">
            <label>Current Password</label>
            <input name="currentPassword" type="password" value={form.currentPassword} onChange={change} placeholder="Enter current password" />
          </div>
          <div className="field">
            <label>New Password</label>
            <input name="newPassword" type="password" value={form.newPassword} onChange={change} placeholder="Min. 8 characters" />
          </div>

          {error   && <div className="err">⚠ {error}</div>}
          {success && <div className="succ">✓ {success}</div>}

          <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem" }}>
            <button type="button" className="btn btn-ghost btn-full" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-full" disabled={busy}>{busy ? "Saving…" : "Save Changes"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

import React, { useState } from "react";
import { useAuth } from "./context/AuthContext.jsx";
import AuthModal    from "./components/AuthModal.jsx";
import ProfileModal from "./components/ProfileModal.jsx";
import Opportunities from "./pages/Opportunities.jsx";
import Hackathons   from "./pages/Hackathons.jsx";
import ResumeCheck  from "./pages/ResumeCheck.jsx";
import Builder      from "./pages/Builder.jsx";
import Planner      from "./pages/Planner.jsx";
import Guidance     from "./pages/Guidance.jsx";
import Contact         from "./pages/Contact.jsx";
import DeadlineTracker from "./pages/DeadlineTracker.jsx";
import LandingPage     from "./pages/LandingPage.jsx";
import "./App.css";

/* ── SVG icons — no emojis ───────────────────────────────── */
const Icons = {
  plane: (
    <svg viewBox="0 0 24 24"><path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" strokeLinecap="round" strokeLinejoin="round"/></svg>
  ),
  briefcase: (
    <svg viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2M12 12v4M10 14h4"/></svg>
  ),
  trophy: (
    <svg viewBox="0 0 24 24"><path d="M6 9H4a2 2 0 01-2-2V5h4M18 9h2a2 2 0 002-2V5h-4M8 21h8M12 17v4M5 5h14v6a7 7 0 01-14 0V5z"/></svg>
  ),
  file: (
    <svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
  ),
  pencil: (
    <svg viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
  ),
  map: (
    <svg viewBox="0 0 24 24"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>
  ),
  bot: (
    <svg viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="2"/><path d="M12 7v4M8 15h.01M16 15h.01"/></svg>
  ),
  mail: (
    <svg viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
  ),
  gear: (
    <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/></svg>
  ),
  logout: (
    <svg viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/></svg>
  ),
  clock: (
    <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
  ),
};

const NAV = [
  { group: "Discover", items: [
    { id: "jobs",    label: "Opportunities", icon: "briefcase", auth: false },
    { id: "hacks",   label: "Hackathons",    icon: "trophy",    auth: false },
  ]},
  { group: "AI Tools", items: [
    { id: "resume",  label: "Resume Check",  icon: "file",      auth: true },
    { id: "builder", label: "Resume Builder",icon: "pencil",    auth: true },
    { id: "planner", label: "Roadmap",       icon: "map",       auth: true },
    { id: "guide",   label: "AI Guide",      icon: "bot",       auth: true },
  ]},
  { group: "More", items: [
    { id: "tracker", label: "Deadlines",      icon: "clock",     auth: false },
    { id: "contact", label: "Contact Us",    icon: "mail",      auth: false },
  ]},
];

const ALL = NAV.flatMap((g) => g.items);

export default function App() {
  const { user, loading, logout } = useAuth();
  const [tab, setTab]   = useState("jobs");
  const [auth, setAuth] = useState(false);
  const [prof, setProf] = useState(false);
  const [showLanding, setShowLanding] = useState(true);

  if (loading) return (
    <div className="splash">
      <div className="splash-mark">{Icons.plane}</div>
      <div className="spinner" />
    </div>
  );

  const openAuth = () => setAuth(true);

  function nav(t) {
    if (t.auth && !user) { openAuth(); return; }
    setTab(t.id);
  }

  const active = ALL.find((t) => t.id === tab);

  if (showLanding) {
    return <LandingPage 
      onEnter={() => setShowLanding(false)} 
      onSignIn={() => {
        setShowLanding(false);
        setTimeout(() => setAuth(true), 10);
      }}
    />;
  }

  return (
    <div className="shell">
      {auth && <AuthModal    onClose={() => setAuth(false)} />}
      {prof && <ProfileModal onClose={() => setProf(false)} />}

      {/* Sidebar */}
      <aside className="sidebar">
        <div className="brand">
          <img src="/logo.png" alt="Career Pilot Logo" style={{ width: '28px', height: '28px', objectFit: 'contain' }} />
          <span className="brand-name">Career Pilot</span>
        </div>

        <div className="sidebar-body">
          {NAV.map((g) => (
            <div key={g.group} className="nav-section">
              <div className="nav-label">{g.group}</div>
              {g.items.map((t) => (
                <button
                  key={t.id}
                  className={`nav-item ${tab === t.id ? "active" : ""}`}
                  onClick={() => nav(t)}
                  title={t.auth && !user ? `${t.label} · Sign in required` : t.label}
                >
                  <span className="nav-icon-wrap">{Icons[t.icon]}</span>
                  <span className="nav-text">{t.label}</span>
                  {t.auth && !user && <span className="nav-lock">⚿</span>}
                </button>
              ))}
            </div>
          ))}
        </div>

        <div className="sidebar-foot">
          {user ? (
            <div className="user-row">
              <div className="ava">{user.name?.[0]?.toUpperCase() || "U"}</div>
              <div className="user-meta">
                <div className="user-nm">{user.name}</div>
                <div className="user-em">{user.email}</div>
              </div>
              <button className="icon-btn" onClick={() => setProf(true)} title="Profile">{Icons.gear}</button>
              <button className="icon-btn del" onClick={logout} title="Sign out">{Icons.logout}</button>
            </div>
          ) : (
            <button className="btn-signin" onClick={openAuth}>Sign in →</button>
          )}
        </div>
      </aside>

      {/* Main */}
      <div className="main">
        <div className="topbar">
          <div>
            <div className="page-title">{active?.label}</div>
            <div className="page-sub">One Stop AI-powered career assistant </div>
          </div>
          <div className="live-dot" title="Live" />
        </div>
        <div className="content">
          {tab === "jobs"    && <Opportunities />}
          {tab === "hacks"   && <Hackathons />}
          {tab === "resume"  && <ResumeCheck  onAuth={openAuth} />}
          {tab === "builder" && <Builder      onAuth={openAuth} />}
          {tab === "planner" && <Planner      onAuth={openAuth} />}
          {tab === "guide"   && <Guidance     onAuth={openAuth} />}
          {tab === "tracker" && <DeadlineTracker />}
          {tab === "contact" && <Contact />}
        </div>
      </div>
    </div>
  );
}

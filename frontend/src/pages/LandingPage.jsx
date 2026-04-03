import React from "react";
import "./LandingPage.css";

export default function LandingPage({ onEnter, onSignIn }) {
  const handleScroll = (e, id) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };
  return (
    <div className="landing-layout">
      <nav className="landing-nav">
        <div className="landing-brand">
          <img src="/logo.png" alt="Career Pilot Logo" className="landing-logo" />
          <span className="landing-logo-text">Career Pilot</span>
        </div>
        <div className="landing-nav-links">
          <a href="#features" onClick={(e) => handleScroll(e, 'features')}>Features</a>
          <a href="#how-it-works" onClick={(e) => handleScroll(e, 'how-it-works')}>How It Works</a>
          <button className="landing-btn-outline" onClick={onSignIn || onEnter}>Sign In</button>
          <button className="landing-btn" onClick={onEnter}>Get Started →</button>
        </div>
      </nav>

      <main className="landing-main">
        <div className="landing-hero">
          <div className="hero-content">
            <h1 className="hero-title">
              Navigate Your Future with <span className="text-teal">Career Pilot</span>
            </h1>
            <p className="hero-subtitle">
              Your AI-powered career assistant. Discover curated opportunities, build ATS-friendly resumes, and track your applications—all in one place.
            </p>
            <div className="hero-ctas">
              <button className="landing-btn-lg" onClick={onEnter}>Launch Your Career</button>
              <button className="landing-btn-outline-lg" onClick={(e) => handleScroll(e, 'features')}>Explore Platform</button>
            </div>
            <div className="hero-stats">
              <div className="stat">
                <h3>Free</h3>
                <p>Platform Access</p>
              </div>
              <div className="stat">
                <h3>8+</h3>
                <p>Curated Tech Tools</p>
              </div>
              <div className="stat">
                <h3>Live</h3>
                <p>Opportunity Feeds</p>
              </div>
            </div>
          </div>
          
          <div className="hero-visual">
            <div className="floating-card c1">
              <div className="c-head">
                <span className="icon">
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z"/></svg>
                </span>
                <span>Resume Match</span>
              </div>
              <div className="c-body">
                <div className="score-ring">
                  <svg viewBox="0 0 36 36" width="60" height="60">
                    <path fill="none" stroke="#eef2f7" strokeWidth="3" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    <path fill="none" stroke="#10b981" strokeWidth="3" strokeDasharray="90, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  </svg>
                  <div className="score-text">90%</div>
                </div>
              </div>
            </div>
            
            <div className="floating-card c2">
              <div className="c-head">
                <span className="icon">
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2M12 12v4M10 14h4"/></svg>
                </span>
                <span>Job Board</span>
              </div>
              <div className="c-body-text">
                <div className="j-title">Live Tech Roles</div>
                <div className="j-comp">Software & Data • Remote</div>
              </div>
            </div>

            <div className="floating-card c3">
              <div className="c-head">
                <span className="icon">
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M6 9H4a2 2 0 01-2-2V5h4M18 9h2a2 2 0 002-2V5h-4M8 21h8M12 17v4M5 5h14v6a7 7 0 01-14 0V5z"/></svg>
                </span>
                <span>Hackathons</span>
              </div>
              <div className="c-body-text">
                <div className="j-title">Global Competitions</div>
                <div className="j-comp">Build & Win Prizes</div>
              </div>
            </div>

            <div className="visual-backdrop"></div>
          </div>
        </div>
      </main>

      <section id="features" className="landing-section">
        <h2 className="section-title">Why Choose Career Pilot?</h2>
        <div className="features-grid">
          <div className="feature-card">
             <div className="feature-icon">
               <svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
             </div>
             <h3>AI-Powered Resume Reviews</h3>
             <p>Get instant ATS scoring and tailored suggestions to make your resume stand out in minutes.</p>
          </div>
          <div className="feature-card">
             <div className="feature-icon">
               <svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2M12 12v4M10 14h4"/></svg>
             </div>
             <h3>Curated Opportunities</h3>
             <p>Access hand-picked software engineering jobs, internships, and remote roles tailored to you.</p>
          </div>
          <div className="feature-card">
             <div className="feature-icon">
               <svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 9H4a2 2 0 01-2-2V5h4M18 9h2a2 2 0 002-2V5h-4M8 21h8M12 17v4M5 5h14v6a7 7 0 01-14 0V5z"/></svg>
             </div>
             <h3>Hackathon Tracking</h3>
             <p>Stay ahead with our live aggregator of global hackathons and tech competitions.</p>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="landing-section alt-bg">
        <h2 className="section-title">How It Works</h2>
        <div className="steps-container">
           <div className="step">
             <div className="step-num">1</div>
             <h3>Sign Up</h3>
             <p>Create your free account in seconds and unlock your dashboard.</p>
           </div>
           <div className="step">
             <div className="step-num">2</div>
             <h3>Analyze Resume</h3>
             <p>Upload your current resume for our AI to critique and improve.</p>
           </div>
           <div className="step">
             <div className="step-num">3</div>
             <h3>Apply & Succeed</h3>
             <p>Use your revamped profile to land top opportunities flawlessly.</p>
           </div>
        </div>
      </section>

      <footer className="landing-footer">
        <div className="footer-content">
          <div className="footer-brand">
             <img src="/logo.png" alt="Logo" className="footer-logo" />
             <span>Career Pilot</span>
          </div>
          <p>© 2026 Career Pilot. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

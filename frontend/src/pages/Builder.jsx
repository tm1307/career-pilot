import React, { useState } from "react";
import { buildResume } from "../api.js";
import { useAuth } from "../context/AuthContext.jsx";

const STEPS = ["Info", "Education", "Experience", "Projects", "Skills"];

const BLANK = {
  name: "", email: "", phone: "", role: "",
  education:  [{ degree: "", institution: "", year: "", gpa: "" }],
  experience: [{ title: "", company: "", duration: "", description: "" }],
  projects:   [{ name: "", tech: "", description: "" }],
  skills:     "",
};

function Field({ label, name, value, onChange, placeholder, as = "input" }) {
  return (
    <div className="field">
      <label>{label}</label>
      {as === "textarea"
        ? <textarea name={name} value={value} onChange={onChange} placeholder={placeholder} style={{ minHeight: 70 }} />
        : <input name={name} value={value} onChange={onChange} placeholder={placeholder} />}
    </div>
  );
}

function ArraySection({ items, onChange, onAdd, onRemove, renderItem }) {
  return (
    <div>
      {items.map((item, i) => (
        <div key={i} className="arr-item">
          <button className="rm-btn" onClick={() => onRemove(i)} title="Remove">✕</button>
          {renderItem(item, i, (field, val) => onChange(i, field, val))}
        </div>
      ))}
      <button className="add-btn" onClick={onAdd}>+ Add another</button>
    </div>
  );
}

function ResumePreview({ data }) {
  if (!data) {
    return (
      <div className="preview-placeholder">
        <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>📄</div>
        <p>Fill in your details and click <strong>Generate with AI</strong> to build your resume.</p>
      </div>
    );
  }
  return (
    <div className="rv">
      <div className="rv-nm">{data._raw?.name || "Your Name"}</div>
      <div className="rv-ct">
        {[data._raw?.email, data._raw?.phone].filter(Boolean).join(" · ")}
      </div>

      {data.summary && (
        <div className="rv-sec">
          <h3>Summary</h3>
          <p className="rv-sm">{data.summary}</p>
        </div>
      )}

      {data.education?.length > 0 && (
        <div className="rv-sec">
          <h3>Education</h3>
          {data.education.map((e, i) => (
            <div key={i} style={{ marginBottom: "0.5rem" }}>
              <div className="rv-it">{e.degree}</div>
              <div className="rv-is">{e.institution} {e.year && `· ${e.year}`} {e.gpa && `· GPA: ${e.gpa}`}</div>
            </div>
          ))}
        </div>
      )}

      {data.experience?.length > 0 && (
        <div className="rv-sec">
          <h3>Experience</h3>
          {data.experience.map((e, i) => (
            <div key={i} style={{ marginBottom: "0.75rem" }}>
              <div className="rv-it">{e.title} — {e.company}</div>
              {e.duration && <div className="rv-is">{e.duration}</div>}
              <ul className="rv-ul">
                {(e.bullets || []).map((b, j) => <li key={j}>{b}</li>)}
              </ul>
            </div>
          ))}
        </div>
      )}

      {data.projects?.length > 0 && (
        <div className="rv-sec">
          <h3>Projects</h3>
          {data.projects.map((p, i) => (
            <div key={i} style={{ marginBottom: "0.75rem" }}>
              <div className="rv-it">{p.name} {p.tech && <span style={{ fontWeight: 400, fontSize: "0.8rem", color: "#555" }}>· {p.tech}</span>}</div>
              <ul className="rv-ul">
                {(p.bullets || []).map((b, j) => <li key={j}>{b}</li>)}
              </ul>
            </div>
          ))}
        </div>
      )}

      {data.skills?.length > 0 && (
        <div className="rv-sec">
          <h3>Skills</h3>
          <div className="rv-sk">{data.skills.join(", ")}</div>
        </div>
      )}
    </div>
  );
}

export default function Builder({ onAuth }) {
  const { user }              = useAuth();
  const [step, setStep]       = useState(0);
  const [form, setForm]       = useState(BLANK);
  const [result, setResult]   = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  if (!user) {
    return (
      <div className="gate-card">
        <div className="gate-icon">✏️</div>
        <div className="gate-title">AI Resume Builder</div>
        <p className="gate-desc">Fill in your details and let AI write polished, ATS-optimized bullet points and a professional summary for you.</p>
        <button className="btn" onClick={onAuth}>Sign in to build →</button>
        <p className="gate-sub">Free · Instant results</p>
      </div>
    );
  }

  function setTop(field, val) { setForm((f) => ({ ...f, [field]: val })); }
  function changeArr(arr, i, field, val) {
    setForm((f) => {
      const copy = [...f[arr]];
      copy[i] = { ...copy[i], [field]: val };
      return { ...f, [arr]: copy };
    });
  }
  function addArr(arr, blank) { setForm((f) => ({ ...f, [arr]: [...f[arr], blank] })); }
  function removeArr(arr, i)  { setForm((f) => ({ ...f, [arr]: f[arr].filter((_, idx) => idx !== i) })); }

  async function generate() {
    if (!form.name.trim() || !form.role.trim()) { setError("Name and target role are required"); return; }
    setLoading(true); setError("");
    try {
      const payload = {
        ...form,
        skills: form.skills.split(",").map((s) => s.trim()).filter(Boolean),
      };
      const data = await buildResume(payload);
      setResult({ ...data, _raw: form });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function print() {
    const win = window.open("", "_blank");
    const el  = document.querySelector(".resume-preview");
    if (!el || !win) return;
    win.document.write(`<html><head><title>Resume</title><style>body{font-family:Georgia,serif;padding:2rem;font-size:14px}h3{text-transform:uppercase;font-size:11px;letter-spacing:.08em;border-bottom:1px solid #ddd;padding-bottom:4px;margin-bottom:8px}ul{padding-left:1rem}</style></head><body>${el.innerHTML}</body></html>`);
    win.document.close();
    win.print();
  }

  const stepDone = [
    !!(form.name && form.email && form.role),
    form.education.some((e) => e.degree),
    form.experience.some((e) => e.title),
    form.projects.some((p) => p.name),
    !!form.skills,
  ];

  return (
    <div className="bld-wrap">
      {/* Form panel */}
      <div className="card">
        <div className="sec-title">✏️ Resume Builder</div>

        <div className="step-tabs">
          {STEPS.map((s, i) => (
            <button
              key={s}
              className={`stab ${step === i ? "on" : ""} ${stepDone[i] ? "done" : ""}`}
              onClick={() => setStep(i)}
            >
              {stepDone[i] ? "✓ " : ""}{s}
            </button>
          ))}
        </div>

        {/* Step 0: Basic info */}
        {step === 0 && (
          <div>
            <Field label="Full Name *"     name="name"  value={form.name}  onChange={(e) => setTop("name",  e.target.value)} placeholder="Jane Smith" />
            <Field label="Target Role *"   name="role"  value={form.role}  onChange={(e) => setTop("role",  e.target.value)} placeholder="Frontend Engineer Intern" />
            <Field label="Email"           name="email" value={form.email} onChange={(e) => setTop("email", e.target.value)} placeholder="jane@example.com" />
            <Field label="Phone"           name="phone" value={form.phone} onChange={(e) => setTop("phone", e.target.value)} placeholder="+91 98765 43210" />
          </div>
        )}

        {/* Step 1: Education */}
        {step === 1 && (
          <ArraySection
            items={form.education}
            onAdd={() => addArr("education", { degree: "", institution: "", year: "", gpa: "" })}
            onRemove={(i) => removeArr("education", i)}
            onChange={(i, f, v) => changeArr("education", i, f, v)}
            renderItem={(item, _, set) => (
              <div>
                <Field label="Degree"      name="degree"      value={item.degree}      onChange={(e) => set("degree",      e.target.value)} placeholder="B.Tech Computer Science" />
                <Field label="Institution" name="institution" value={item.institution} onChange={(e) => set("institution", e.target.value)} placeholder="IIT Delhi" />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
                  <Field label="Year"  name="year" value={item.year} onChange={(e) => set("year", e.target.value)} placeholder="2025" />
                  <Field label="GPA"   name="gpa"  value={item.gpa}  onChange={(e) => set("gpa",  e.target.value)} placeholder="8.5/10" />
                </div>
              </div>
            )}
          />
        )}

        {/* Step 2: Experience */}
        {step === 2 && (
          <ArraySection
            items={form.experience}
            onAdd={() => addArr("experience", { title: "", company: "", duration: "", description: "" })}
            onRemove={(i) => removeArr("experience", i)}
            onChange={(i, f, v) => changeArr("experience", i, f, v)}
            renderItem={(item, _, set) => (
              <div>
                <Field label="Role Title"   name="title"    value={item.title}    onChange={(e) => set("title",    e.target.value)} placeholder="Software Intern" />
                <Field label="Company"      name="company"  value={item.company}  onChange={(e) => set("company",  e.target.value)} placeholder="Google" />
                <Field label="Duration"     name="duration" value={item.duration} onChange={(e) => set("duration", e.target.value)} placeholder="May 2024 – Aug 2024" />
                <Field label="What you did" name="description" value={item.description} onChange={(e) => set("description", e.target.value)} placeholder="Built X using Y, improved Z by 30%…" as="textarea" />
              </div>
            )}
          />
        )}

        {/* Step 3: Projects */}
        {step === 3 && (
          <ArraySection
            items={form.projects}
            onAdd={() => addArr("projects", { name: "", tech: "", description: "" })}
            onRemove={(i) => removeArr("projects", i)}
            onChange={(i, f, v) => changeArr("projects", i, f, v)}
            renderItem={(item, _, set) => (
              <div>
                <Field label="Project Name" name="name"        value={item.name}        onChange={(e) => set("name",        e.target.value)} placeholder="CareerPilot" />
                <Field label="Tech Stack"   name="tech"        value={item.tech}        onChange={(e) => set("tech",        e.target.value)} placeholder="React, Node.js, MongoDB" />
                <Field label="Description"  name="description" value={item.description} onChange={(e) => set("description", e.target.value)} placeholder="What it does and what impact it had…" as="textarea" />
              </div>
            )}
          />
        )}

        {/* Step 4: Skills */}
        {step === 4 && (
          <div>
            <div className="field">
              <label>Skills (comma-separated)</label>
              <textarea
                value={form.skills}
                onChange={(e) => setTop("skills", e.target.value)}
                placeholder="JavaScript, React, Node.js, Python, Git, SQL…"
                style={{ minHeight: 100 }}
              />
            </div>
          </div>
        )}

        <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem" }}>
          {step > 0 && <button className="btn btn-outline" onClick={() => setStep((s) => s - 1)} style={{ flex: 1 }}>← Back</button>}
          {step < STEPS.length - 1
            ? <button className="btn" onClick={() => setStep((s) => s + 1)} style={{ flex: 1 }}>Next →</button>
            : <button className="btn btn-full" onClick={generate} disabled={loading}>{loading ? "Generating…" : "✨ Generate with AI"}</button>
          }
        </div>

        {error && <div className="err">{error}</div>}
      </div>

      {/* Preview panel */}
      <div className="card">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
          <div className="sec-title" style={{ margin: 0 }}>📄 Preview</div>
          {result && <button className="btn btn-outline" onClick={print} style={{ fontSize: "0.78rem", padding: "0.35rem 0.8rem" }}>🖨 Print / Save PDF</button>}
        </div>

        {loading && <div className="loader"><div className="dots"><span/><span/><span/></div>AI is writing your resume…</div>}
        {!loading && <ResumePreview data={result} />}
      </div>
    </div>
  );
}

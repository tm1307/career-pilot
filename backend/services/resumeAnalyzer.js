const SKILLS = {
  javascript: { weight: 3, aliases: ["javascript", "js"] },
  react:      { weight: 3, aliases: ["react", "react.js", "reactjs"] },
  node:       { weight: 3, aliases: ["node", "node.js", "nodejs"] },
  python:     { weight: 3, aliases: ["python"] },
  java:       { weight: 2, aliases: ["java"] },
  "c++":      { weight: 2, aliases: ["c++"] },
  sql:        { weight: 2, aliases: ["sql", "mysql", "postgresql"] },
  git:        { weight: 2, aliases: ["git", "github"] },
  html:       { weight: 2, aliases: ["html", "html5"] },
  css:        { weight: 2, aliases: ["css", "css3"] },
  docker:     { weight: 2, aliases: ["docker"] },
  aws:        { weight: 3, aliases: ["aws", "amazon web services"] },
  typescript: { weight: 2, aliases: ["typescript", "ts"] },
  mongodb:    { weight: 2, aliases: ["mongodb", "mongo"] },
  fastapi:    { weight: 2, aliases: ["fastapi"] },
};

const SECTIONS = {
  education:  ["education", "degree", "university", "college", "b.tech", "btech"],
  experience: ["experience", "intern", "internship", "worked", "employment"],
  projects:   ["project", "projects", "built", "developed", "created"],
  skills:     ["skills", "technical skills", "technologies", "tools"],
};

export function analyzeResume(text) {
  if (!text || text.trim().length < 50) {
    return {
      atsScore: 0,
      confidence: "Very Low",
      matchedSkills: [],
      missingSkills: Object.keys(SKILLS),
      detectedSections: {},
      issues: ["Resume text is unreadable or too short"],
      suggestions: ["Upload a text-based PDF (not scanned images)", "Avoid Canva or image-heavy resumes"],
    };
  }

  const normalized = text
    .toLowerCase()
    .replace(/[^\w\s.+/#]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  // Detect sections
  const detectedSections = {};
  for (const [section, keywords] of Object.entries(SECTIONS)) {
    detectedSections[section] = keywords.some((kw) =>
      new RegExp(`\\b${kw}\\b`, "i").test(normalized)
    );
  }

  // Score skills
  let skillScore = 0;
  let maxSkillScore = 0;
  const matchedSkills = [];
  const missingSkills = [];

  for (const [skill, { weight, aliases }] of Object.entries(SKILLS)) {
    maxSkillScore += weight;
    const found = aliases.some((alias) => {
      const escaped = alias.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      return new RegExp(`(^|\\s)${escaped}(?=[\\s./+]|$)`, "i").test(normalized);
    });
    if (found) { matchedSkills.push(skill); skillScore += weight; }
    else missingSkills.push(skill);
  }

  // Structure bonus (30% of total)
  const structureBonus =
    (detectedSections.education  ? 5  : 0) +
    (detectedSections.experience ? 10 : 0) +
    (detectedSections.projects   ? 10 : 0) +
    (detectedSections.skills     ? 5  : 0);

  const atsScore = Math.round(
    (skillScore / maxSkillScore) * 70 + (structureBonus / 30) * 30
  );

  const confidence = atsScore >= 75 ? "High" : atsScore >= 50 ? "Medium" : "Low";

  const issues = [];
  const suggestions = [];

  if (!detectedSections.projects) {
    issues.push("Projects section not detected");
    suggestions.push("Add a dedicated 'Projects' section listing tech stacks used");
  }
  if (!detectedSections.experience) {
    issues.push("Experience/internships not highlighted");
    suggestions.push("Add any internships, freelance work, or open-source contributions");
  }
  if (matchedSkills.length < 4) {
    issues.push("Low technical keyword density");
    suggestions.push("Explicitly list frameworks, tools, and technologies");
    suggestions.push("Mirror keywords from job descriptions you're targeting");
  }
  if (text.trim().length < 300) {
    issues.push("Resume appears very short");
    suggestions.push("Expand with more detail on projects and responsibilities");
  }

  return { atsScore, confidence, matchedSkills, missingSkills, detectedSections, issues, suggestions };
}

# Career Pilot

**One stop AI-powered career tool** for students - resume analysis, roadmap planning, job discovery, and hackathon tracking, built for the Indian market.

![React](https://img.shields.io/badge/React-Vite-06b6d4?style=for-the-badge&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-22c55e?style=for-the-badge&logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47a248?style=for-the-badge&logo=mongodb)
![Groq AI](https://img.shields.io/badge/Groq_AI-LLaMA_3.1-f59e0b?style=for-the-badge)
![Vercel](https://img.shields.io/badge/Frontend-Vercel-white?style=for-the-badge&logo=vercel&logoColor=black)
![Render](https://img.shields.io/badge/Backend-Render-46e3b7?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-white?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Active-22c55e?style=for-the-badge)

### ð Live â [career-pilot-ashy.vercel.app](https://career-pilot-ashy.vercel.app)

---

## Problem Statement

Most students hit the same wall when starting their career:

| Problem | Impact |
|---|---|
| Resumes not optimized for ATS systems | Applications never reach a human reviewer |
| No clear path from current skills to job-ready | Time wasted on the wrong resources |
| Career advice is generic, expensive, or inaccessible | Poor interview and application preparation |
| Hackathons and opportunities scattered across platforms | Missed deadlines, missed chances |

Career Pilot solves all four - free, in one place.

---

## Features

| Feature | How it works | Auth |
|---|---|---|
| **Opportunities** | Live job listings from the Adzuna API, filterable by role and location | - |
| **Hackathons** | Aggregates from Unstop, Devpost, Dare2Compete, and MLH - no paid API required | - |
| **Resume Check** | Upload a PDF; backend extracts text, runs ATS keyword + structure scoring, LLaMA generates targeted feedback | â |
| **Resume Builder** | Fill in your details; LLaMA returns polished, action-verb-driven bullet points and a professional summary | â |
| **Roadmap Planner** | Describe your target role and timeline; returns a week-by-week learning plan saved to your profile | â |
| **AI Guide** | Conversational career counsellor - interview prep, skill gaps, salary negotiation, career pivots | â |
| **Deadline Tracker** | Client-side deadline management, no backend required | - |

---

## System Architecture

```
+------------------------------------------------------------------+
|                      FRONTEND  (React + Vite)                    |
|  Opportunities . Hackathons . Resume . Builder . Planner . Guide  |
+----------------------------------+-------------------------------+
                                   |  REST API
                                   v
+------------------------------------------------------------------+
|                    BACKEND  (Node.js + Express)                   |
|                                                                  |
|  /api/auth         /api/resume        /api/builder               |
|  JWT + bcrypt      pdf2json           Groq + LLaMA 3.1           |
|                    resumeAnalyzer                                |
|                                                                  |
|  /api/planner      /api/guide         /api/jobs                  |
|  Groq + LLaMA 3.1  Groq + LLaMA 3.1   Adzuna API                |
|                                                                  |
|  /api/hackathons --> scrapes Unstop, Devpost, D2C, MLH           |
|                                                                  |
|                    MongoDB + Mongoose  (Users, Plans)            |
+------------------------------------------------------------------+
```

---

## Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, custom CSS |
| Backend | Node.js, Express (ESM) |
| Database | MongoDB Atlas, Mongoose |
| Auth | JWT, bcrypt |
| AI | Groq SDK - LLaMA 3.1 8B Instant |
| Jobs | Adzuna API |
| Hackathons | axios + cheerio (web scraping, no paid API) |
| File Handling | multer, pdf2json |
| Deployment | Vercel (frontend), Render (backend) |

---

## Project Structure

```
career-pilot/
âââ backend/
â   âââ middleware/             # JWT auth guard
â   âââ models/                 # User, Plan (Mongoose schemas)
â   âââ routes/                 # One file per feature endpoint
â   âââ services/
â   â   âââ llmService.js       # Groq wrapper - shared by all AI routes
â   â   âââ resumeAnalyzer.js   # Keyword + structure ATS scoring
â   â   âââ jobFetcher.js       # Adzuna integration
â   â   âââ hackathonFetcher.js # Scrapes Unstop, Devpost, D2C, MLH
â   âââ server.js               # Entry point, rate limiters, CORS
â
âââ frontend/
    âââ src/
        âââ pages/              # One component per feature
        âââ components/         # AuthModal, ProfileModal
        âââ context/            # Auth state via React Context
        âââ App.jsx             # Sidebar shell + tab routing
```

---

## Getting Started

### Prerequisites

- Node.js v18+
- MongoDB Atlas cluster
- [Groq API key](https://console.groq.com/)
- [Adzuna API credentials](https://developer.adzuna.com/)

### 1. Clone

```bash
git clone https://github.com/your-username/career-pilot.git
cd career-pilot
```

### 2. Backend

```bash
cd backend
npm install
```

Create `backend/.env`:

```env
GROQ_API_KEY=
MONGO_URI=
JWT_SECRET=                      # 32+ random characters
PORT=5001
ALLOWED_ORIGINS=http://localhost:5173
ADZUNA_APP_ID=
ADZUNA_API_KEY=
```

> Never commit `.env`. Verify it is listed in `.gitignore` before pushing.

```bash
npm run dev     # development (auto-restart)
npm start       # production
```

Server runs on `http://localhost:5001`.

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`.

---

## API Reference

| Method | Route | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | - | Create account |
| POST | `/api/auth/login` | - | Returns JWT |
| GET | `/api/jobs` | - | Job listings (Adzuna) |
| GET | `/api/hackathons` | - | Hackathon listings (scraped) |
| POST | `/api/resume` | â | PDF upload â ATS score + feedback |
| POST | `/api/builder/generate` | â | AI-generated resume content |
| POST | `/api/planner` | â | Career roadmap |
| POST | `/api/guide` | â | AI career chat |

**Rate limits** - 200 req / 15 min globally Â· 30 req / 15 min on auth routes Â· 15 req / 1 min on AI routes

### Example - Resume Check

```bash
curl -X POST http://localhost:5001/api/resume \\
  -H "Authorization: Bearer <token>" \\
  -F "resume=@your_resume.pdf"
```

```json
{
  "atsScore": 74,
  "confidence": "Medium",
  "matchedSkills": ["python", "react", "git"],
  "missingSkills": ["docker", "aws", "typescript"],
  "suggestions": [
    "Add a dedicated Projects section listing tech stacks used",
    "Explicitly list frameworks, tools, and technologies"
  ]
}
```

---

## Usage Guide

**Resume Check** - Upload a PDF. The backend extracts text, scores it against ATS keyword patterns, and LLaMA returns specific improvement suggestions.

**Resume Builder** - Enter your role, education, experience, projects, and skills. LLaMA generates action-verb bullet points and a professional summary ready to copy.

**Roadmap Planner** - Describe your goal and timeline (e.g. *"Beginner to Data Science internship in 3 months"*). Returns a week-by-week plan with topics, tasks, and resources, saved to your profile.

**AI Guide** - Ask anything: interview prep, skill gaps, salary negotiation, career pivots. Powered by LLaMA 3.1 via Groq.

**Hackathons** - Browse upcoming hackathons aggregated live from Unstop, Devpost, Dare2Compete, and MLH. Filter by mode (online/offline) and location.

**Deadline Tracker** - Add and track your application deadlines client-side, no account needed.

---

## Deployment

| Layer | Platform | URL |
|---|---|---|
| Frontend | Vercel | career-pilot-ashy.vercel.app |
| Backend | Render | port 10000 |

Set all environment variables in your host's dashboard. Add the production frontend URL to `ALLOWED_ORIGINS` on the backend.

---

## Security

- Passwords hashed with bcrypt (12 rounds)
- JWT verified server-side on every protected route
- MongoDB input sanitized via `express-mongo-sanitize`
- CORS restricted to explicitly allowed origins
- PDF uploads capped at 5 MB, stored in memory only (never written to disk)

---

## Roadmap

- [ ] LinkedIn profile analyser
- [ ] Job description keyword matcher
- [ ] Interview question generator by role
- [ ] Resume PDF export with ATS suggestions applied
- [ ] Email alerts for new job listings
- [ ] Admin dashboard to view registered users

---

## Contributing

1. Fork the repository
2. Create a feature branch - `git checkout -b feature/your-feature`
3. Commit your changes - `git commit -m "add: your feature"`
4. Push to the branch - `git push origin feature/your-feature`
5. Open a Pull Request

---

<div align="center">
  <strong>Career Pilot - Navigate Your Career with AI</strong><br/>
  Built with React Â· Node.js Â· MongoDB Â· Groq (LLaMA 3.1) Â· Express
</div>

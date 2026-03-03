# Career Pilot

**One stop AI-powered career tool** for students — resume analysis, roadmap planning, job discovery, and hackathon tracking, built for the Indian market.

---

## What It Does

Career Pilot brings everything a student needs into a single dashboard. Public features are available without an account; AI-powered tools unlock after signing in.

| Feature | How it works | Auth |
|---|---|---|
| **Opportunities** | Live job listings from the Adzuna API, filterable by role and location | — |
| **Hackathons** | Aggregates from Unstop, Devpost, Dare2Compete, and MLH — no paid API required | — |
| **Resume Check** | Upload a PDF; backend extracts text, runs ATS keyword scoring, LLaMA generates targeted feedback | ✓ |
| **Resume Builder** | Fill in your details; LLaMA returns polished, action-verb-driven bullet points and a professional summary | ✓ |
| **Roadmap Planner** | Describe your target role and timeline; returns a week-by-week learning plan saved to your profile | ✓ |
| **AI Guide** | Conversational career counsellor powered by LLaMA 3.1 | ✓ |
| **Deadline Tracker** | Client-side deadline management, no backend required | — |

---

## Stack

**Frontend** — React 18, Vite, custom CSS (no component library)

**Backend** — Node.js · Express (ESM) · MongoDB + Mongoose · JWT + bcrypt · Groq SDK (LLaMA 3.1 8B Instant) · Adzuna API · pdf2json · cheerio

---

## Project Structure

```
career-pilot/
├── backend/
│   ├── middleware/             # JWT auth guard
│   ├── models/                 # User, Plan (Mongoose schemas)
│   ├── routes/                 # One file per feature endpoint
│   ├── services/
│   │   ├── llmService.js       # Groq wrapper — shared by all AI routes
│   │   ├── resumeAnalyzer.js   # Keyword + structure ATS scoring
│   │   ├── jobFetcher.js       # Adzuna integration
│   │   └── hackathonFetcher.js # Scrapes Unstop, Devpost, D2C, MLH
│   └── server.js               # Entry point, rate limiters, CORS
│
└── frontend/
    └── src/
        ├── pages/              # One component per feature
        ├── components/         # AuthModal, ProfileModal
        ├── context/            # Auth state via React Context
        └── App.jsx             # Sidebar shell + tab routing
```

---

## Getting Started

### Prerequisites

- Node.js v18+
- MongoDB Atlas cluster
- [Groq API key](https://console.groq.com/)
- [Adzuna API credentials](https://developer.adzuna.com/)

### Backend

```bash
cd backend
npm install
```

Create `backend/.env`:

```env
GROQ_API_KEY=
MONGO_URI=
JWT_SECRET=          # 32+ random characters
PORT=5001
ALLOWED_ORIGINS=http://localhost:5173
ADZUNA_APP_ID=
ADZUNA_API_KEY=
```

> Never commit `.env`. Verify it is in `.gitignore` before pushing.

```bash
npm run dev     # development (auto-restart)
npm start       # production
```

Server runs on `http://localhost:5001`.

### Frontend

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
| POST | `/api/auth/register` | — | Create account |
| POST | `/api/auth/login` | — | Returns JWT |
| GET | `/api/jobs` | — | Job listings (Adzuna) |
| GET | `/api/hackathons` | — | Hackathon listings (scraped) |
| POST | `/api/resume` | ✓ | PDF upload → ATS score + feedback |
| POST | `/api/builder/generate` | ✓ | AI-generated resume content |
| POST | `/api/planner` | ✓ | Career roadmap |
| POST | `/api/guide` | ✓ | AI career chat |

**Rate limits** — 200 req / 15 min globally · 30 req / 15 min on auth routes · 15 req / 1 min on AI routes

---

## Deployment

| Layer | Platform |
|---|---|
| Frontend | Vercel |
| Backend | Render (port 10000) |

Set all environment variables in your host's dashboard and add the production frontend URL to `ALLOWED_ORIGINS`.

---

## Security

- Passwords hashed with bcrypt (12 rounds)
- JWT verified server-side on every protected route
- MongoDB input sanitized via `express-mongo-sanitize`
- CORS restricted to explicitly allowed origins
- PDF uploads capped at 5 MB, stored in memory only

---

## Project Structure

```
career-pilot/
├── backend/
│   ├── middleware/auth.js          # JWT verification
│   ├── models/                     # User, Plan schemas
│   ├── routes/                     # auth, resume, builder, planner, guide, jobs, hackathons
│   ├── services/
│   │   ├── llmService.js           # Groq / LLaMA wrapper
│   │   ├── resumeAnalyzer.js       # ATS scoring logic
│   │   ├── jobFetcher.js           # Adzuna API integration
│   │   └── hackathonFetcher.js     # Scrapes Unstop, Devpost, D2C, MLH
│   ├── server.js                   # Express entry point
│   └── .env                        # Environment variables
│
└── frontend/
    └── src/
        ├── pages/                  # One component per feature
        ├── components/             # AuthModal, ProfileModal
        ├── context/AuthContext.jsx
        ├── api.js                  # Axios API client
        └── App.jsx                 # Root + sidebar nav
```

---

## ⚙️ Setup & Installation

### Prerequisites

- Node.js **v18+**
- A MongoDB Atlas cluster (or local MongoDB)
- A [Groq API key](https://console.groq.com/)
- An [Adzuna API key](https://developer.adzuna.com/)

---

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/career-pilot.git
cd career-pilot
```

---

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory:

```env
# AI
GROQ_API_KEY=your_groq_api_key_here

# Database
MONGO_URI=mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/?appName=Cluster0

# Auth — use a strong random string (32+ chars)
JWT_SECRET=your_jwt_secret_here

# Server
PORT=5001

# CORS — comma-separated allowed origins
ALLOWED_ORIGINS=http://localhost:5173

# Adzuna Job API
ADZUNA_APP_ID=your_adzuna_app_id
ADZUNA_API_KEY=your_adzuna_api_key
```

> ⚠️ **Never commit your `.env` file.** Make sure it's listed in `.gitignore`.

Start the backend:

```bash
# Development (with auto-restart)
npm run dev

# Production
npm start
```

The server runs on `http://localhost:5001` by default.

---

### 3. Frontend Setup

```bash
cd ../frontend
npm install
npm run dev
```

The frontend runs on `http://localhost:5173`.

---

## 🔌 API Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | No | Register a new user |
| `POST` | `/api/auth/login` | No | Login, returns JWT |
| `GET` | `/api/jobs` | No | Fetch job listings (Adzuna) |
| `GET` | `/api/hackathons` | No | Fetch hackathons (scraped) |
| `POST` | `/api/resume` | ✅ | Upload PDF, get ATS score + feedback |
| `POST` | `/api/builder` | ✅ | Generate AI resume content |
| `POST` | `/api/planner` | ✅ | Generate career roadmap |
| `POST` | `/api/guide` | ✅ | AI career guidance chat |

### Rate Limits

| Route group | Limit |
|---|---|
| All routes (global) | 200 requests / 15 min |
| `/api/auth/*` | 30 requests / 15 min |
| AI routes (planner, guide, builder) | 15 requests / 1 min |

---

## 🌐 Deployment

The project is configured for:

- **Frontend** → [Vercel](https://vercel.com/) (`career-pilot-ashy.vercel.app`)
- **Backend** → [Render](https://render.com/) (port `10000`)

When deploying, set all environment variables in your hosting provider's dashboard and update `ALLOWED_ORIGINS` to include your production frontend URL.

---

## 🔒 Security Notes

- Passwords are hashed with **bcrypt** (12 salt rounds)
- JWT tokens are verified on all protected routes via middleware
- MongoDB queries are sanitized via `express-mongo-sanitize`
- CORS is restricted to explicitly allowed origins
- File uploads are limited to **5MB** PDFs only

---

## 📄 License

MIT License

Copyright (c) 2024 Career Pilot

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

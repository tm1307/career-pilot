# ✈️ Career Pilot

> **One Stop AI-powered career tool** — discover jobs, prep your resume, plan your roadmap, and compete in hackathons, all in one place.

---

## 🚀 Features

| Module | Description | Auth Required |
|---|---|---|
| **Opportunities** | Browse live job listings powered by the Adzuna API | No |
| **Hackathons** | Aggregates listings from Unstop, Devpost, Dare2Compete & MLH | No |
| **Resume Check** | Upload a PDF resume and get an AI-powered ATS score with feedback | ✅ Yes |
| **Resume Builder** | AI-assisted resume builder that generates tailored content | ✅ Yes |
| **Roadmap / Planner** | AI generates a personalized career learning roadmap | ✅ Yes |
| **AI Guide** | Chat with an AI career counsellor | ✅ Yes |
| **Deadline Tracker** | Track application deadlines locally | No |
| **Contact** | Contact form | No |

---

## 🛠️ Tech Stack

### Frontend
- **React 18** with Vite
- Single-page app with sidebar navigation
- No external UI libraries — custom CSS

### Backend
- **Node.js** + **Express** (ESM modules)
- **MongoDB** via Mongoose
- **JWT** authentication with bcrypt password hashing
- **Groq SDK** → LLaMA 3.1 8B Instant for all AI features
- **Adzuna API** for job listings
- **pdf2json** + **multer** for PDF resume parsing
- **axios** + **cheerio** for hackathon scraping (no API keys needed)
- Rate limiting via `express-rate-limit`

---

## 📁 Project Structure

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

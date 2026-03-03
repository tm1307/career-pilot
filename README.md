# Career Pilot v3 🚀

AI-powered career assistant for Indian students — jobs (Remote + India), hackathons, resume analysis, AI resume builder, roadmap planner, and AI guidance.

## Features
| Feature | Auth Required |
|---|---|
| Browse jobs (Remote / India / Unstop) | No |
| Save/bookmark jobs | No (localStorage) |
| Browse hackathons by city & mode | No |
| ATS Resume Analyzer | Yes |
| AI Resume Builder | Yes |
| Career Roadmap Generator | Yes |
| AI Career Guide | Yes |

## Setup

### Backend
```bash
cd backend
npm install
# Edit .env — your GROQ + MongoDB keys are pre-filled
# Optionally add ADZUNA_APP_ID + ADZUNA_API_KEY for India jobs (free at developer.adzuna.com)
npm start
```

### Frontend
```bash
cd frontend
npm install
# .env already set to http://localhost:5001
npm run dev
```

## Deployment

### Backend → Render / Railway
- Set all env vars from `backend/.env`
- Start: `npm start`
- ⚠️ Change `JWT_SECRET` to a random 32+ char string

### Frontend → Vercel
- Set `VITE_API_URL` = your backend URL (e.g. `https://career-pilot-api.onrender.com`)
- Update `ALLOWED_ORIGINS` in backend to include your Vercel URL

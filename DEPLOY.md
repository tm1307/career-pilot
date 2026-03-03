# Career Pilot v5 — Deployment Guide 🚀

---

## ✅ Using Your Existing Vercel & Render Links

Your existing Vercel and Render projects are connected to your GitHub repo.
**You don't need to do anything in Vercel or Render dashboards.**

Just push the new code to the same repo:

```bash
# Inside career-pilot-v5/ folder — copy files over your old repo
# OR if you want to replace the old code entirely:

cd /path/to/your-existing-repo   # the repo that Vercel/Render is watching

# Copy backend files
cp -r /path/to/career-pilot-v5/backend/* ./backend/

# Copy frontend files  
cp -r /path/to/career-pilot-v5/frontend/* ./frontend/

git add .
git commit -m "v5: new UI, fixed hackathons, contact form, D2C source"
git push
```

Both Vercel and Render **auto-deploy on every push to main** — that's it.
Your URLs stay exactly the same. ✅

---

## First-Time Setup (if not already done)

### Backend → Render
1. New Web Service → connect repo → root: `backend`
2. Build: `npm install` · Start: `npm start`
3. Environment variables:

| Key | Value |
|-----|-------|
| `GROQ_API_KEY` | your key |
| `MONGO_URI` | your MongoDB URI |
| `JWT_SECRET` | random 32+ char string (`openssl rand -hex 32`) |
| `PORT` | `5001` |
| `ALLOWED_ORIGINS` | your Vercel URL |
| `ADZUNA_APP_ID` | from developer.adzuna.com |
| `ADZUNA_API_KEY` | from developer.adzuna.com |

### Frontend → Vercel
1. New Project → connect repo → root: `frontend`
2. Framework: Vite (auto-detected)
3. Environment variable: `VITE_API_URL` = your Render URL

---

## Local Dev

```bash
# Terminal 1
cd backend && npm install && npm run dev

# Terminal 2
cd frontend && npm install && npm run dev
# → http://localhost:5173
```

---

## Security before going live
- [ ] Set a strong `JWT_SECRET` (not the default)
- [ ] Rotate `GROQ_API_KEY` if ever committed to git
- [ ] Rotate MongoDB password if ever committed
- [ ] `.env` is in `.gitignore` ✓

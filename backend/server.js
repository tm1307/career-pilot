import "dotenv/config";
import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";
import mongoose from "mongoose";

import debugRoutes from "./routes/debug.js";
import authRoutes      from "./routes/auth.js";
import resumeRoutes    from "./routes/resume.js";
import jobRoutes       from "./routes/jobs.js";
import hackathonRoutes from "./routes/hackathons.js";
import plannerRoutes   from "./routes/planner.js";
import guideRoutes     from "./routes/guide.js";
import builderRoutes   from "./routes/builder.js";

const app = express();

// ── Database ──────────────────────────────────────────────────────────────────
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err.message));

// ── CORS (must come before everything else) ───────────────────────────────────
const allowedOrigins = (process.env.ALLOWED_ORIGINS || "")
  .split(",")
  .map((o) => o.trim());

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      const isAllowed = allowedOrigins.some((allowed) =>
        origin.startsWith(allowed)
      );

      if (isAllowed) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.options("*", cors());
// ── Body parsing ──────────────────────────────────────────────────────────────
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true, limit: "2mb" }));
app.use(mongoSanitize());

// ── Rate limiting ─────────────────────────────────────────────────────────────
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests — please wait before retrying." },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: { error: "Too many auth attempts — please wait." },
});

const aiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 min
  max: 15,
  message: { error: "AI rate limit reached — wait a moment." },
});

app.use(globalLimiter);

// ── Routes ────────────────────────────────────────────────────────────────────
app.use("/api/auth",       authLimiter, authRoutes);
app.use("/api/resume",     resumeRoutes);
app.use("/api/jobs",       jobRoutes);
app.use("/api/hackathons", hackathonRoutes);
app.use("/api/planner",    aiLimiter, plannerRoutes);
app.use("/api/guide",      aiLimiter, guideRoutes);
app.use("/api/builder",    aiLimiter, builderRoutes);

app.use("/api/debug", debugRoutes);

app.get("/", (_req, res) => res.json({ status: "ok", version: "3.0.0" }));

// ── Global error handler ──────────────────────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error("Unhandled error:", err.message);
  res.status(err.status || 500).json({ error: err.message || "Internal server error" });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`🚀 Server on port ${PORT}`));

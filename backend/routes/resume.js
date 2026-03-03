import express from "express";
import multer from "multer";
import PDFParser from "pdf2json";
import { analyzeResume } from "../services/resumeAnalyzer.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

function parsePDF(buffer) {
  return new Promise((resolve, reject) => {
    const parser = new PDFParser(null, 1);
    parser.on("pdfParser_dataError", (e) => reject(new Error(e.parserError)));
    parser.on("pdfParser_dataReady", (pdf) => {
      try {
        const text = pdf.Pages.flatMap((page) =>
          page.Texts.flatMap((t) =>
            t.R.map((r) => {
              try { return decodeURIComponent(r.T); } catch { return r.T; }
            })
          )
        ).join(" ");
        resolve(text.replace(/%20/g, " ").replace(/\s+/g, " ").trim());
      } catch (err) {
        reject(new Error("Failed to parse PDF structure"));
      }
    });
    parser.parseBuffer(buffer);
  });
}

// POST /api/resume/check
router.post("/check", upload.single("resume"), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No resume file uploaded" });

  try {
    const text = await parsePDF(req.file.buffer);
    if (!text || text.length < 50) {
      return res.status(400).json({ error: "Could not extract text — please upload a text-based PDF, not a scanned image" });
    }
    res.json(analyzeResume(text));
  } catch (err) {
    console.error("Resume check error:", err.message);
    res.status(500).json({ error: "Resume processing failed: " + err.message });
  }
});

export default router;

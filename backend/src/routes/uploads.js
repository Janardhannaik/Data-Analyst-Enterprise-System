const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const uploadMiddleware = require("../middleware/multerConfig");
const Upload = require("../models/Upload");
const pythonService = require("../services/pythonService");
const path = require("path");
const fs = require("fs");

// ---------------------------
// 1️⃣ Upload + Analyze
// POST /api/uploads
// ---------------------------
router.post("/", auth, (req, res, next) => {
  // use multer with explicit callback so Multer errors are handled nicely
  uploadMiddleware.single("file")(req, res, async (err) => {
    if (err) {
      // Multer error (file too large / invalid type etc.)
      console.error("Multer error:", err);
      return res.status(400).json({ error: err.message });
    }

    try {
      const file = req.file;
      if (!file) return res.status(400).json({ error: "No file uploaded" });

      // Save metadata first
      const upload = await Upload.create({
        user: req.user._id,
        filename: file.originalname,
        path: file.path,
        mimetype: file.mimetype,
        size: file.size,
        notes: req.body.notes,
        status: "processing",
      });

      try {
        // Call python service (this currently sends the file path)
        // NOTE: In production you may want to enqueue a background job instead
        const analysis = await pythonService.analyzeFile(file.path);

        upload.analysis = analysis;
        upload.status = "done";
        await upload.save();

        return res.json({ message: "Upload & analysis successful", upload });
      } catch (pyErr) {
        console.error("Python analysis failed:", pyErr.message || pyErr);
        upload.status = "error";
        upload.analysis = {
          error: pyErr.response?.data || pyErr.message || String(pyErr),
        };
        await upload.save();
        // return 500 but include message for frontend
        return res.status(500).json({
          error: "Python analysis failed",
          details: pyErr.message || pyErr,
        });
      }
    } catch (err) {
      next(err);
    }
  });
});

// ---------------------------
// 2️⃣ Get all uploads (history)
// GET /api/uploads
// ---------------------------
router.get("/", auth, async (req, res) => {
  try {
    // return user's uploads, newest first
    const uploads = await Upload.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .lean()
      .limit(100); // TODO: add pagination (skip/limit) if you expect many uploads

    return res.json({ uploads });
  } catch (err) {
    console.error("Failed to fetch uploads:", err);
    return res.status(500).json({ error: "Failed to fetch uploads" });
  }
});

// ---------------------------
// 3️⃣ Get latest upload
// GET /api/uploads/latest
// ---------------------------
router.get("/latest", auth, async (req, res) => {
  try {
    const latest = await Upload.findOne({ user: req.user._id })
      .sort({ createdAt: -1 })
      .lean();

    if (!latest) return res.status(404).json({ error: "No uploads found" });

    return res.json({ upload: latest });
  } catch (err) {
    console.error("Failed to fetch latest upload:", err);
    return res.status(500).json({ error: "Failed to fetch latest upload" });
  }
});

// ---------------------------
// 4️⃣ Get specific upload by id
// GET /api/uploads/:id
// ---------------------------
// NOTE: keep this after /latest and / to avoid route conflicts
router.get("/:id", auth, async (req, res) => {
  try {
    const upload = await Upload.findOne({
      _id: req.params.id,
      user: req.user._id,
    }).lean();
    if (!upload) return res.status(404).json({ error: "Upload not found" });
    return res.json({ upload });
  } catch (err) {
    console.error("Failed to fetch upload by ID:", err);
    return res.status(500).json({ error: "Failed to fetch upload" });
  }
});

// ---------------------------
// 5️⃣ Download original file
// GET /api/uploads/download/:id
// ---------------------------
router.get("/download/:id", auth, async (req, res) => {
  try {
    const upload = await Upload.findOne({
      _id: req.params.id,
      user: req.user._id,
    }).lean();
    if (!upload) return res.status(404).json({ error: "Upload not found" });

    const filePath = path.resolve(upload.path);
    if (!fs.existsSync(filePath))
      return res.status(404).json({ error: "File not found on server" });

    return res.download(filePath, upload.filename);
  } catch (err) {
    console.error("Download error:", err);
    return res.status(500).json({ error: "Failed to download file" });
  }
});

module.exports = router;

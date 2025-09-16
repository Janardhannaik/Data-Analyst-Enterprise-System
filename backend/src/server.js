require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");
const businessRoutes = require("./routes/businesses");
const uploadRoutes = require("./routes/uploads");
const errorHandler = require("./middleware/errorHandler");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;

// --------------------
// DB connection
// --------------------
connectDB();

// --------------------
// Middleware
// --------------------
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173", // 👈 match frontend
    credentials: true,
  })
);
app.use(express.json());

// --------------------
// Static uploads dir
// --------------------
const UPLOAD_DIR = process.env.UPLOAD_DIR || path.join(__dirname, "uploads");
app.use("/uploads", express.static(path.resolve(UPLOAD_DIR)));

// --------------------
// Routes
// --------------------
app.use("/api/auth", authRoutes);
app.use("/api/businesses", businessRoutes);
app.use("/api/uploads", uploadRoutes);

// --------------------
// Error handler
// --------------------
app.use(errorHandler);

// --------------------
// Start server
// --------------------
app.listen(PORT, () =>
  console.log(`✅ Server running on http://localhost:${PORT}`)
);

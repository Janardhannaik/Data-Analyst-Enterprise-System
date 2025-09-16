// const express = require("express");
// const router = express.Router();
// const User = require("../models/User");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const auth = require("../middleware/auth");

// router.post("/register", async (req, res, next) => {
//   try {
//     const { email, password } = req.body;
//     if (!email || !password)
//       return res.status(400).json({ message: "Missing fields" });
//     const existing = await User.findOne({ email });
//     if (existing) return res.status(400).json({ message: "User exists" });
//     const hashed = await bcrypt.hash(password, 10);
//     const user = await User.create({ email, password: hashed });
//     const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
//     res.json({ token });
//   } catch (err) {
//     next(err);
//   }
// });

// router.post("/login", async (req, res, next) => {
//   try {
//     const { email, password } = req.body;
//     const user = await User.findOne({ email });
//     if (!user) return res.status(400).json({ message: "Invalid credentials" });
//     const ok = await bcrypt.compare(password, user.password);
//     if (!ok) return res.status(400).json({ message: "Invalid credentials" });
//     const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
//     res.json({ token });
//   } catch (err) {
//     next(err);
//   }
// });

// router.get("/me", auth, async (req, res) => {
//   res.json(req.user);
// });

// module.exports = router;

const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Upload = require("../models/Upload"); // ✅ import Upload model
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");

router.post("/register", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Missing fields" });
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "User exists" });
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hashed });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.json({ token });
  } catch (err) {
    next(err);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({ message: "Invalid credentials" });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.json({ token });
  } catch (err) {
    next(err);
  }
});

router.get("/me", auth, async (req, res) => {
  try {
    // Base user info
    const userData = {
      _id: req.user._id,
      email: req.user.email,
      createdAt: req.user.createdAt,
    };

    // Count uploads
    const totalUploads = await Upload.countDocuments({ user: req.user._id });

    // Get last 5 uploads
    const recentUploads = await Upload.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(5)
      .select("filename createdAt status")
      .lean();

    res.json({
      ...userData,
      totalUploads,
      recentUploads,
    });
  } catch (err) {
    console.error("Error in /me:", err);
    res.status(500).json({ error: "Failed to fetch profile" });
  }
});

module.exports = router;

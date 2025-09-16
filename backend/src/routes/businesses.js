const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Business = require("../models/Business");
const User = require("../models/User");

router.get("/my", auth, async (req, res, next) => {
  try {
    const business = await Business.findOne({ owner: req.user._id });
    res.json(business || {});
  } catch (err) {
    next(err);
  }
});

router.post("/", auth, async (req, res, next) => {
  try {
    const payload = { ...req.body, owner: req.user._id };
    let business = await Business.findOne({ owner: req.user._id });
    if (business) {
      business.set(payload);
      await business.save();
    } else {
      business = await Business.create(payload);
      req.user.businesses.push(business._id);
      await req.user.save();
    }
    res.json(business);
  } catch (err) {
    next(err);
  }
});

module.exports = router;

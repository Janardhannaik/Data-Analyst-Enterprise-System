const mongoose = require("mongoose");

const UploadSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    business: { type: mongoose.Schema.Types.ObjectId, ref: "Business" },
    filename: String,
    path: String,
    mimetype: String,
    size: Number,
    status: { type: String, default: "pending" },
    analysis: { type: Object, default: null },
    notes: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Upload", UploadSchema);

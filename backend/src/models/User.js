const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: true },
    businesses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Business" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);

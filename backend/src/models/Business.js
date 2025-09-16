const mongoose = require("mongoose");

const BusinessSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    name: String,
    currency: { type: String, default: "USD" },
    columnMappings: { type: Object, default: {} },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Business", BusinessSchema);

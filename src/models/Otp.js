const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  code: {
    type: Number,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  expireAt: {
    type: Date,
    required: true,
  },
  uses: {
    type: Number,
    default: 0, // 3
  },
}, { timestamps: true });

const model = mongoose.model("Otp", schema);

module.exports = model;

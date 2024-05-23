const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: true,
    },
    admin: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    answerID: {
      type: mongoose.Types.ObjectId,
      ref: "Notification",
    },
    seen: {
      type: Number,
      default: 0
    },
  },
  { timestamps: true }
);

const model = mongoose.model("Notification", schema);

module.exports = model;

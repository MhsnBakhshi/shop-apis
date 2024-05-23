const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    token: {
      required: true,
      type: String
    },
    user: {
      required: true,
      ref: "User",
      type: mongoose.Types.ObjectId,
    },
    expire: {
      type: Date,
      required: true
    }
  },
  { timestamps: true }
);

const model = mongoose.model("ResetPassword", schema);

module.exports = model;
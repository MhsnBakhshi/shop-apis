const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    href: {
      type: String,
      required: true,
    },
    parent: {
      type: mongoose.Types.ObjectId,
      ref: "Menu",
    },
  },
  { timestamps: true }
);

const model = mongoose.model("Menu", schema);

module.exports = model;

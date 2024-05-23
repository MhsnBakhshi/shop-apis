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
    }
  },
  { timestamps: true }
);

const model = mongoose.model("Category", schema);

module.exports = model;
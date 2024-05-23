const mongoose = require("mongoose");

const schema = mongoose.Schema(
  {
    phone: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const model = mongoose.model("Ban", schema);

module.exports = model;

const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    product: {
      required: true,
      ref: "Product",
      type: mongoose.Types.ObjectId,
    },
    user: {
      required: true,
      ref: "User",
      type: mongoose.Types.ObjectId,
    },
  },
  { timestamps: true }
);

const model = mongoose.model("Save", schema);

module.exports = model;

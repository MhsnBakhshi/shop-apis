const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
    },
    percent: { // %
      type: Number,
      required: true,
    },
    product: {
      type: mongoose.Types.ObjectId,
      ref: "Product",
    },
    max: {
      type: Number,
      required: true,
    },
    uses: {
      type: Number,
      required: true,
    },
    creator: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    }
  },
  { timestamps: true }
);

const model = mongoose.model("Discount", schema);

module.exports = model;

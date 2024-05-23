const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    departmentID: {
      type: mongoose.Types.ObjectId,
      ref: "Department",
      required: true,
    },
    departmentSubID: {
      type: mongoose.Types.ObjectId,
      ref: "DepartmentSub",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    answer: {
      type: Number,
      default: 0,
    },
    product: {
      type: mongoose.Types.ObjectId,
      ref: "Product",
      required: false,
    },
    parent: {
      type: mongoose.Types.ObjectId,
      ref: "Ticket",
      required: false,
    },
    isAnswer: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const model = mongoose.model("Ticket", schema);

module.exports = model;

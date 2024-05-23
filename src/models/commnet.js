const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    body: {
      type: String,
      required: true,
    },
    product: {
      type: mongoose.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    creator: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isAccept: {
      type: Number, // 0 => Didn't Answered || 1= => Answered
      default: 0,
    },
    score: {
      type: Number,
      default: 5,
    },
    isAnswer: {
      type: Number, // 0 => mainComment || 1= => answerComment
      required: true
    },
    mainCommentID: {
      type: mongoose.Types.ObjectId,
      ref: "Comment"
    }
  },
  { timestamps: true }
);

const model = mongoose.model("Comment", schema);

module.exports = model;

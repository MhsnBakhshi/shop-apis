const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  phone: {
    type: Number,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  answer: {
    type: Number,
    required: true
  },
  text: {
    type: String,
    required: true
  },
},  { timestamps: true });

const model = mongoose.model("Contact", schema);

module.exports = model
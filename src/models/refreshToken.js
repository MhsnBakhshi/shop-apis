const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
const schema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "User",
    },
    token: {
      type: String,
      required: true,
      unique: true,
    },
    expire: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

schema.statics.createToken = async (user) => {
  const refreshToken = uuidv4();
  await model.create({
    user: user._id,
    token: refreshToken,
    expire: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
  });

  return refreshToken;
};
schema.statics.verifyToken = async (token) => {
  const refreshTokenDocument = await model.findOne({ token });

  if (refreshTokenDocument && refreshTokenDocument.expire >= Date.now()) {
    return refreshTokenDocument.user;
  } else {
    return null;
  }
};
const model = mongoose.model("RefreshToken", mongoose.Schema(schema));
module.exports = model;

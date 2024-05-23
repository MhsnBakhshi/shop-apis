const userModel = require("../../models/User");
const banUserModel = require("../../models/ban");
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const { errResponses, succsessResponses } = require("../../utils/responses");
exports.getAll = async (req, res, next) => {
  try {
    const users = await userModel
      .find({})
      .sort({ _id: -1 })
      .select("-__v -password")
      .lean();

    return succsessResponses(res, 200, users);
  } catch (err) {
    next(err);
  }
};

exports.changeUserInfo = async (req, res, next) => {
  try {
    const { name, username, email } = req.body;
    const userID = req.user._id;
    const user = await userModel.findOneAndUpdate(
      { _id: userID },
      { name, username, email }
    );

    if (!user) {
      return errResponses(res, 404, "The User Not Found !!");
    }
    return succsessResponses(res, 200, "The User Updated ;)");
  } catch (err) {
    next(err);
  }
};

exports.changeRole = async (req, res, next) => {
  try {
    const { userID } = req.body;

    const isValidID = mongoose.Types.ObjectId.isValid(userID);

    if (!isValidID) {
      return errResponses(res, 409, "The ID Is Not Valid !!");
    }
    const user = await userModel.find({ _id: userID });

    let newRole = user.role === "ADMIN" ? "USER" : "ADMIN";

    const changedRole = await userModel.findByIdAndUpdate(
      { _id: userID },
      { role: newRole }
    );

    if (changedRole) {
      return succsessResponses(res, 201, "The Role Is Changed ;)");
    }
  } catch (err) {
    next(err);
  }
};

exports.banUser = async (req, res, next) => {
  try {
    const { userID } = req.params;

    const isValidID = mongoose.Types.ObjectId.isValid(userID);

    if (!isValidID) {
      return errResponses(res, 409, "The ID Is Not Valid !!");
    }
    const deletedUser = await userModel.findOneAndDelete({ _id: userID });

    if (!deletedUser) {
      return errResponses(res, 404, "The User Not Found!! Check ID");
    }

    await banUserModel.create({ phone: deletedUser.phone });
    return succsessResponses(res, 200, "The User Banned ;)");
  } catch (err) {
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const { userID } = req.params;

    const isValidID = mongoose.Types.ObjectId.isValid(userID);

    if (!isValidID) {
      return errResponses(res, 409, "The ID Is Not Valid !!");
    }

    const removedUser = await userModel.findOneAndDelete({ _id: userID });

    if (!removedUser) {
      return errResponses(res, 404, "The User Not Found !! Check ID");
    }
    return succsessResponses(res, 200, "The User Removed Succesfully ;)");
  } catch (err) {
    next(err);
  }
};

exports.setProfile = async (req, res, next) => {
  try {
    const userID = req.user._id;

    if (!req.file) {
      return errResponses(
        res,
        409,
        "No Uploading File !! Please Upload File ..."
      );
    }

    const { filename } = req.file;
    const filePath = `public/profile/${filename}`;

    await userModel.findOneAndUpdate(
      { _id: userID },
      {
        profile: filePath,
      }
    );

    return succsessResponses(res, 200, "The Profile Uploaded ;)");
  } catch (err) {
    next(err);
  }
};

exports.removeProfile = async (req, res, next) => {
  try {
    const userID = req.user._id;

    const user = await userModel.findOne({ _id: userID });

    if (!user) {
      return errResponses(res, 404, "There Is No User From This ID !!");
    }

    if (user.profile) {
      const profilePath = path.join(__dirname, "..", "..", "..", user.profile);

      fs.unlinkSync(profilePath);

      await userModel.findByIdAndUpdate(
        { _id: userID },
        { $unset: { profile: null } }
      );
      return succsessResponses(res, 200, "The Profile Deleted ;)");
    } else {
      return errResponses(
        res,
        400,
        "You Have No Uploading File For Your Profile  Yet !! Upload Frist."
      );
    }
  } catch (err) {
    next(err);
  }
};

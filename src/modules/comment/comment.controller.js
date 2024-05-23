const commentModel = require("../../models/commnet");
const productModel = require("../../models/product");
const { errResponses, succsessResponses } = require("../../utils/responses");
const mongoose = require("mongoose");

exports.create = async (req, res, next) => {
  try {
    const { body, productID, score } = req.body;

    if (!mongoose.Types.ObjectId.isValid(productID)) {
      return errResponses(res, 409, "The productID Is Not Valid !!");
    }

    const product = await productModel.findOne({ _id: productID });

    if (!product) {
      return errResponses(res, 404, "The Product Not Found !!");
    }

    await commentModel.create({
      body,
      isAccept: 0,
      isAnswer: 0,
      creator: req.user._id,
      product: product._id,
      score,
    });

    return succsessResponses(res, 201, "The Commnet Created ;)");
  } catch (err) {
    next(err);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const { commentID } = req.params;

    if (!mongoose.Types.ObjectId.isValid(commentID)) {
      return errResponses(res, 409, "The ID Is Not Valid !!");
    }
    const deletedComment = await commentModel.findOneAndDelete({
      _id: commentID,
    });

    if (!deletedComment) {
      return errResponses(res, 404, "The Comment Not Found !!");
    }

    return succsessResponses(res, 200, "The Comment Deleted ;)");
  } catch (err) {
    next(err);
  }
};
exports.answer = async (req, res, next) => {
  try {
    const { commentID } = req.params;
    const { body } = req.body;

    if (!mongoose.Types.ObjectId.isValid(commentID)) {
      return errResponses(res, 409, "The ID Is Not Valid !!");
    }

    const acceptedComment = await commentModel.findOneAndUpdate(
      { _id: commentID },
      {
        isAccept: 1,
      }
    );

    if (!acceptedComment) {
      return errResponses(res, 404, "The Comment Not Found !!");
    }
    await commentModel.create({
      body,
      creator: req.user._id,
      isAccept: 1,
      isAnswer: 1,
      mainCommentID: commentID,
      product: acceptedComment.product,
    });

    return succsessResponses(res, 201, "The Comment Answered ;)");
  } catch (err) {
    next(err);
  }
};
exports.reject = async (req, res, next) => {
  try {
    const { commentID } = req.params;

    if (!mongoose.Types.ObjectId.isValid(commentID)) {
      return errResponses(res, 409, "The ID Is Not Valid !!");
    }

    const rejectedComment = await commentModel.findOneAndUpdate(
      {
        _id: commentID,
      },
      { isAccept: 0 }
    );

    if (!rejectedComment) {
      return errResponses(res, 404, "The Comment Not Found !!");
    }

    return succsessResponses(res, 200, "The Comment Rejected ;)");
  } catch (err) {
    next(err);
  }
};
exports.accept = async (req, res, next) => {
  try {
    const { commentID } = req.params;

    if (!mongoose.Types.ObjectId.isValid(commentID)) {
      return errResponses(res, 409, "The ID Is Not Valid !!");
    }

    const acceptedComment = await commentModel.findOneAndUpdate(
      {
        _id: commentID,
      },
      { isAccept: 1 }
    );

    if (!acceptedComment) {
      return errResponses(res, 404, "The Comment Not Found !!");
    }

    return succsessResponses(res, 200, "The Comment Accepted ;)");
  } catch (err) {
    next(err);
  }
};
exports.edit = async (req, res, next) => {
  try {
    const { commentID } = req.params;
    const { body } = req.body;
    if (!mongoose.Types.ObjectId.isValid(commentID)) {
      return errResponses(res, 409, "The ID Is Not Valid !!");
    }
    const editedComment = await commentModel.findOneAndUpdate(
      { _id: commentID },
      { body }
    );
    if (!editedComment) {
      return errResponses(res, 404, "The Comment Not Found !!");
    }

    return succsessResponses(res, 201, "The Comment Edited ;)");
  } catch (err) {
    next(err);
  }
};
exports.getAllCommentsForAdmin = async (req, res, next) => {
  try {
    const comments = await commentModel
      .find({})
      .populate({
        path: "product",
        select: "-createdAt -updatedAt -__v",
        populate: {
          path: "categoryID",
          model: "Category",
          select: "-createdAt -updatedAt -__v",
        },
      })
      .populate({
        path: "product",
        select: "-createdAt -updatedAt -__v",
        populate: {
          path: "own",
          model: "User",
          select: "name username email phone profile",
        },
      })
      .populate("creator", "name username profile phone email")
      .populate("mainCommentID", "body")
      .select("-createdAt -updatedAt -__v")
      .lean();

    if (!comments) {
      return errResponses(res, 404, "There Is No Comment !!");
    }
    return succsessResponses(res, 200, "All Comments 👇", comments);
  } catch (err) {
    next(err);
  }
};
exports.getOnCommentForAdmin = async (req, res, next) => {
  try {
    const { commentID } = req.params;

    if (!mongoose.Types.ObjectId.isValid(commentID)) {
      return errResponses(res, 409, "The ID Is Not Valid !!");
    }

    const comment = await commentModel
      .findOne({ _id: commentID })
      .populate({
        path: "product",
        select: "-createdAt -updatedAt -__v",
        populate: {
          path: "categoryID",
          model: "Category",
          select: "-createdAt -updatedAt -__v",
        },
      })
      .populate({
        path: "product",
        select: "-createdAt -updatedAt -__v",
        populate: {
          path: "own",
          model: "User",
          select: "name username email phone profile",
        },
      })
      .populate("creator", "name username profile phone email")
      .populate("mainCommentID", "body")
      .select("-createdAt -updatedAt -__v")
      .lean();

    if (!comment) {
      return errResponses(res, 404, "The Comment Not Found !!");
    }
    return succsessResponses(res, 200, "Comment You Wanted 👇", comment);
  } catch (err) {
    next(err);
  }
};

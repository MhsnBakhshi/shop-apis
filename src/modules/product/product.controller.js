const productModel = require("../../models/product");
const saveModel = require("../../models/save");
const commentModel = require("../../models/commnet");
const productUserModel = require("../../models/product-user");
const likeModel = require("../../models/like");
const { errResponses, succsessResponses } = require("../../utils/responses");
const mongoose = require("mongoose");
exports.create = async (req, res, next) => {
  try {
    const { discount, categoryID, name, description, href, price, status } =
      req.body;

    const product = await productModel.create({
      discount,
      categoryID,
      name,
      description,
      href,
      price,
      status,
      own: req.user._id,
    });

    return succsessResponses(res, 201, "The Product Created ;)");
  } catch (err) {
    next(err);
  }
};

exports.setCover = async (req, res, next) => {
  try {
    if (!req.file) {
      return errResponses(err, 409, "No File Uploaded Yet!!");
    }
    const { filename } = req.file;
    const filePath = `public/cover/${filename}`;

    const product = await productModel.findOneAndUpdate(
      { own: req.user._id },
      { cover: filePath }
    );

    if (!product) {
      return errResponses(err, 404, "Product Not Found!!");
    }
    return succsessResponses(res, 200, "The Cover Uploaded ;)");
  } catch (err) {
    next(err);
  }
};
exports.removeCover = async (req, res, next) => {
  try {
    const userID = req.user._id;

    const product = await productModel.findOne({ _id: userID });

    if (!product) {
      return errResponses(res, 404, "There Is No Product From This ID !!");
    }

    if (product.cover) {
      const caverPath = path.join(__dirname, "..", "..", "..", product.cover);

      fs.unlinkSync(caverPath);

      await productModel.findByIdAndUpdate(
        { _id: userID },
        { $unset: { cover: null } }
      );
      return succsessResponses(res, 200, "The Cover Deleted ;)");
    } else {
      return errResponses(
        res,
        400,
        "You Have No Uploading File For Your Product Yet !! Upload Frist."
      );
    }
  } catch (err) {
    next(err);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const { productID } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productID)) {
      return errResponses(res, 409, "The ID Is Not Valid");
    }
    const deletedProduct = await productModel.findOneAndDelete({
      _id: productID,
    });

    if (!deletedProduct) {
      return errResponses(res, 404, "There Is No Product From This ID !!");
    }
    const coverPath = path.join(
      __dirname,
      "..",
      "..",
      "..",
      deletedProduct.cover
    );

    fs.unlinkSync(coverPath);
    return succsessResponses(res, 200, "The Product Deleted ;)");
  } catch (err) {
    next(err);
  }
};

exports.getAll = async (req, res, next) => {
  try {
    const products = await productModel
      .find({})
      .select("-createdAt -updatedAt -__v")
      .populate("own", "name username email phone")
      .lean();

    if (!products) {
      return errResponses(res, 404, "There Is No Product !!");
    }
    return succsessResponses(res, 200, "Products List 👇", products);
  } catch (err) {
    next(err);
  }
};

exports.getOne = async (req, res, next) => {
  try {
    const { productID } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productID)) {
      return errResponses(res, 404, "The ID Is Not Valid");
    }
    const product = await productModel
      .findOne({
        _id: productID,
      })
      .select("-createdAt -updatedAt -__v")
      .populate("own", "name username email phone profile")
      .populate("categoryID", "-createdAt -updatedAt -__v");

    if (!product) {
      return errResponses(res, 404, "There Is No Product From This ID !!");
    }

    const isSaved = !!(await saveModel.find({ product: productID }));
    const isLiked = !!(await likeModel.find({ product: productID }));
    const comments = await commentModel
      .find({ product: productID })
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
      .populate("creator", "name username cover")
      .select("-createdAt -updatedAt -__v")
      .lean();

    let allComments = [];

    comments.forEach((comment) => {
      let mainCommentAnswerInfo = null;
      comments.forEach((answerComment) => {
        if (String(comment._id) === String(answerComment.mainCommentID)) {
          mainCommentAnswerInfo = { ...answerComment };
        }
      });
      if (!comment.mainCommentID) {
        allComments.push({
          ...comment,
          product: comment.product.name,
          answerContent: mainCommentAnswerInfo,
        });
      }
    });

    return succsessResponses(res, 200, "The Product Info 👇", {
      product,
      comments: allComments,
      isSaved,
      isLiked,
    });
  } catch (err) {
    next(err);
  }
};

exports.edit = async (req, res, next) => {
  try {
    const { name, description, href, price, status, discount, categoryID } =
      req.body;

    const editedProduct = await productModel
      .findOneAndUpdate(
        {
          own: req.user._id,
        },
        {
          name,
          description,
          href,
          price,
          status,
          discount,
          categoryID,
        },
        { new: true }
      )
      .select("-createdAt -updatedAt -__v")
      .populate("own", "name username email phone")
      .lean();

    if (!editedProduct) {
      return errResponses(
        res,
        404,
        "The Product Not Found Or This Product not For U Check ID !!"
      );
    }
    return succsessResponses(res, 200, "The Product Edited ;)", editedProduct);
  } catch (err) {
    next(err);
  }
};

exports.save = async (req, res, next) => {
  try {
    const userID = req.user._id;
    const { productID } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productID)) {
      return errResponses(res, 409, "The ID Is Not Valid");
    }
    const product = await productModel.findOne({
      _id: productID,
    });
    if (!product) {
      return errResponses(res, 404, "The Product Not Found !!");
    }
    await saveModel.create({
      product: product._id,
      user: userID,
    });

    return succsessResponses(res, 200, "The Product Saved ;)");
  } catch (err) {
    next(err);
  }
};

exports.unsave = async (req, res, next) => {
  try {
    const userID = req.user._id;
    const { productID } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productID)) {
      return errResponses(res, 409, "The ID Is Not Valid");
    }
    const save = await saveModel.findOne({
      product: productID,
      user: userID,
    });
    if (!save) {
      return errResponses(res, 404, "The Product Not Found !!");
    }
    await saveModel.findOneAndDelete({
      _id: save._id,
    });

    return succsessResponses(res, 200, "The Product unSaved ;)");
  } catch (err) {
    next(err);
  }
};

exports.like = async (req, res, next) => {
  try {
    const userID = req.user._id;
    const { productID } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productID)) {
      return errResponses(res, 409, "The ID Is Not Valid");
    }
    const product = await productModel.findOne({
      _id: productID,
    });
    if (!product) {
      return errResponses(res, 404, "The Product Not Found !!");
    }
    await likeModel.create({
      product: product._id,
      user: userID,
    });

    return succsessResponses(res, 200, "The Product Liked ;)");
  } catch (err) {
    next(err);
  }
};

exports.dislike = async (req, res, next) => {
  try {
    const userID = req.user._id;
    const { productID } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productID)) {
      return errResponses(res, 409, "The ID Is Not Valid");
    }
    const like = await likeModel.findOne({
      product: productID,
      user: userID,
    });
    if (!like) {
      return errResponses(res, 404, "The Product Not Found !!");
    }
    await likeModel.findOneAndDelete({
      _id: like._id,
    });

    return succsessResponses(res, 200, "The Product disliked ;)");
  } catch (err) {
    next(err);
  }
};

exports.showAllSavesProduct = async (req, res, next) => {
  try {
    const usersID = req.user._id;
    const savesProduct = await saveModel
      .find({ user: usersID })
      .select("-createdAt -updatedAt -__v")
      .populate("product", "-createdAt -updatedAt -__v -own")
      .populate("user", "name email username phone")
      .lean();

    if (!savesProduct) {
      return errResponses(res, 404, "There Is No Product Saved Yet ;(");
    } else {
      return succsessResponses(res, 200, "The Saves List 👇", savesProduct);
    }
  } catch (err) {
    next(err);
  }
};

exports.buy = async (req, res, next) => {
  try {
    const userID = req.user._id;
    const { productID } = req.body;

    if (!mongoose.Types.ObjectId.isValid(productID)) {
      return errResponses(res, 409, "The ProductID Is Not Valid ;(");
    }
    const product = await productModel.findOne({ _id: productID });

    if (!product) {
      return errResponses(res, 404, "The Product Not Found ;(");
    }

    await productUserModel.create({
      product: product._id,
      user: userID,
      price: product.price,
    });

    return succsessResponses(res, 201, "The Product Added In Basket ;)");
  } catch (err) {
    next(err);
  }
};
exports.removeProductFromBasket = async (req, res, next) => {
  try {
    const userID = req.user._id;
    const { productID } = req.body;

    if (!mongoose.Types.ObjectId.isValid(productID)) {
      return errResponses(res, 409, "The ProductID Is Not Valid ;(");
    }
    const product = await productUserModel.findOneAndDelete({
      product: productID,
    });

    if (!product.length) {
      return errResponses(res, 404, "The Product Not Found ;(");
    }
    return succsessResponses(
      res,
      200,
      "The Product Deleted From Your Basket ;)"
    );
  } catch (err) {
    next(err);
  }
};

exports.getUserBasketInfo = async (req, res, next) => {
  try {
    const userID = req.user._id;

    const basket = await productUserModel
      .find({ user: userID })
      .select("-createdAt -updatedAt -__v ")
      .populate("product", "description name cover discount")
      .populate("user", "name username email phone")
      .lean();

    if (!basket.length) {
      return errResponses(res, 400, "The Basket Is Empity Yet ;(");
    } else {
      return succsessResponses(res, 200, basket);
    }
  } catch (err) {
    next(err);
  }
};

exports.getUserBasketsForAdmin = async (req, res, next) => {
  try {
    const { userID } = req.body;
    if (!mongoose.Types.ObjectId.isValid(userID)) {
      return errResponses(res, 409, "The userID Is Not Valid ;(");
    }

    const userBasket = await productUserModel
      .find({ user: userID })
      .populate({
        path: "product",
        select: "-own -createdAt -updatedAt -__v",
        populate: {
          path: "categoryID",
          select: "-own -createdAt -updatedAt -__v",
          model: "Category",
        },
      })
      .populate("user", "name username email phone")
      .select("-createdAt -updatedAt -__v ")
      .lean();

    if (!userBasket.length) {
      return errResponses(
        res,
        400,
        "The User Basket Is Empity !! No Product Buyed;("
      );
    }
    return succsessResponses(res, 200, userBasket);
  } catch (err) {
    next(err);
  }
};

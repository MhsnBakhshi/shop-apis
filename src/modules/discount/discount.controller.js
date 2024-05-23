const discountModel = require("../../models/discount");
const productModel = require("../../models/product");
const { errResponses, succsessResponses } = require("../../utils/responses");
const mongoose = require("mongoose");

exports.create = async (req, res, next) => {
  try {
    const { code, percent, product, max } = req.body;

    if (!mongoose.Types.ObjectId.isValid(product)) {
      return errResponses(res, 409, "The Product ID Is Not Valid ;(");
    }
    const isProductInDB = !!(await productModel.findOne({ _id: product }));

    if (!isProductInDB) {
      return errResponses(res, 404, "The Product Not Found ;(");
    }
    await discountModel.create({
      code,
      percent,
      product,
      max,
      uses: 0,
      creator: req.user._id,
    });

    return succsessResponses(res, 200, "The Discount Code Created ;)");
  } catch (err) {
    next(err);
  }
};

exports.getAll = async (req, res, next) => {
  try {
    const discounts = await discountModel
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
      .populate("creator", "name username phone email profile")
      .select("-__v -updatedAt -createdAt")
      .lean();

    if (!discounts) {
      return errResponses(res, 404, "There Is No Notification ;(");
    }
    return succsessResponses(res, 200, discounts);
  } catch (err) {
    next(err);
  }
};

exports.edit = async (req, res, next) => {
  try {
    const { code, percent, max } = req.body;
    const { discountID } = req.params;

    if (!mongoose.Types.ObjectId.isValid(discountID)) {
      return errResponses(res, 409, "The discountID Is Not Valid ;(");
    }

    const edit = await discountModel.findOneAndUpdate(
      { _id: discountID },
      {
        code,
        percent,
        max,
      }
    );
    if (!edit) {
      return errResponses(res, 404, "The Discount Not Found ;(");
    }
    return succsessResponses(res, 200, "The Discount Edited ;)");
  } catch (err) {
    next(err);
  }
};

exports.deleteOne = async (req, res, next) => {
  try {
    const { discountID } = req.params;

    if (!mongoose.Types.ObjectId.isValid(discountID)) {
      return errResponses(res, 409, "The discountID Is Not Valid ;(");
    }

    const deleted = await discountModel.findOneAndDelete({ _id: discountID });

    if (!deleted) {
      return errResponses(res, 404, "The Discount Not Found ;(");
    }
    return succsessResponses(res, 200, "The Discount Deleted ;)");
  } catch (err) {
    next(err);
  }
};

exports.deleteAll = async (req, res, next) => {
  try {
    await discountModel.deleteMany();
    return succsessResponses(res, 200, "All Discounts Deleted ;)");
  } catch (err) {
    next(err);
  }
};
exports.setOn = async (req, res, next) => {
  try {
    const { productID } = req.params;
    const { discount } = req.body;

    if (!mongoose.Types.ObjectId.isValid(productID)) {
      return errResponses(res, 409, "The productID Is Not Valid ;(");
    }

    const product = await productModel.findOneAndUpdate(
      { _id: productID },
      { discount }
    );

    if (!product) {
      return errResponses(res, 404, "The Product Not Found ;(");
    }
    return succsessResponses(res, 200, "The Discount Seted ;)");
  } catch (err) {
    next(err);
  }
};
exports.setOnToAll = async (req, res, next) => {
  try {
    const { discount } = req.body;

    await productModel.updateMany({ discount });

    return succsessResponses(res, 200, "All Discounts Updated ;)");
  } catch (err) {
    next(err);
  }
};

exports.getOne = async (req, res, next) => {
  try {
    const { code } = req.params;
    const { product } = req.body;

    if (!mongoose.Types.ObjectId.isValid(product)) {
      return errResponses(res, 409, "The Product ID Is Not Valid ;(");
    }
    const isProductInDB = !!(await productModel.findOne({ _id: product }));

    if (!isProductInDB) {
      return errResponses(res, 404, "The Product Not Found ;(");
    }

    const discount = await discountModel.findOne({ code, product });

    if (!discount) {
      return errResponses(res, 405, "The Discount Not Found ;(");
    } else if (discount.uses === discount.max) {
      return errResponses(res, 400, "The Discount Is Max Used ;(");
    } else {
      await discountModel.findOneAndUpdate(
        { code, product },
        { uses: discount.uses + 1 }
      );

      return succsessResponses(res, 200, "U Can Use Code");
    }
  } catch (err) {
    next(err);
  }
};

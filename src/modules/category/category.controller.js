const categoryModel = require("../../models/Category");
const { errResponses, succsessResponses } = require("../../utils/responses");
const mongoose = require("mongoose");
exports.create = async (req, res, next) => {
  try {
    const { title, href } = req.body;
    const category = await categoryModel.create({ title, href });

    return succsessResponses(res, 201, "The Category Created ;)", category);
  } catch (err) {
    next(err);
  }
};

exports.getAll = async (req, res, next) => {
  try {
    const category = await categoryModel
      .find({})
      .sort({ _id: -1 })
      .select("-createdAt -updatedAt -__v")
      .lean();
    return succsessResponses(res, 200, "The Category List 👇 ", category);
  } catch (err) {
    next(err);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const { categoryID } = req.params;

    if (!mongoose.Types.ObjectId.isValid(categoryID)) {
      return errResponses(res, 409, "The ID Is Not Valid !!");
    }
    const category = await categoryModel.findOneAndDelete({ _id: categoryID });
    if (!category) {
      return errResponses(res, 404, "The Category Not Found !!");
    }

    return succsessResponses(res, 200, "The Category Deleted ;) ");
  } catch (err) {
    next(err);
  }
};

exports.edit = async (req, res, next) => {
  try {
    const { categoryID } = req.params;
    const { href, title } = req.body;

    if (!mongoose.Types.ObjectId.isValid(categoryID)) {
      return errResponses(res, 409, "The ID Is Not Valid !!");
    }
    const category = await categoryModel.findByIdAndUpdate(categoryID, {
      href,
      title,
    });
    if (!category) {
      return errResponses(res, 404, "The Category Not Found !!");
    }

    return succsessResponses(res, 200, "The Category Edited ;) ");
  } catch (err) {
    next(err);
  }
};

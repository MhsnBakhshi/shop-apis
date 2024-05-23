const departmentModel = require("../../models/department");
const { errResponses, succsessResponses } = require("../../utils/responses");
const mongoose = require("mongoose");

exports.departments = async (req, res, next) => {
  try {
    const departments = await departmentModel
      .find({})
      .select("-__v -updatedAt -createdAt")
      .lean();

    if (!departments) {
      return errResponses(res, 404, "The Departments List Is Empity :(");
    } else {
      return succsessResponses(res, 200, departments);
    }
  } catch (err) {
    next(err);
  }
};
exports.create = async (req, res, next) => {
  try {
    const { title } = req.body;
    await departmentModel.create({ title });

    return succsessResponses(res, 201, "The Department Crerated :)");
  } catch (err) {
    next(err);
  }
};
exports.edit = async (req, res, next) => {
  try {
    const { title, id } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return errResponses(res, 409, "The id Is Not Mongo ID ");
    }
    const edited = await departmentModel.findOneAndUpdate(
      { _id: id },
      { title }
    );
    if (!edited) {
      return errResponses(res, 404, "The Department Not Found ");
    }

    return succsessResponses(res, 200, "The Title Edited ;)");
  } catch (err) {
    next(err);
  }
};
exports.delete = async (req, res, next) => {
  try {
    const { id } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return errResponses(res, 409, "The id Is Not Mongo ID ");
    }
    const deleted = await departmentModel.findOneAndDelete({ _id: id });

    if (!deleted) {
      return errResponses(res, 404, "The Department Not Found ");
    }

    return succsessResponses(res, 200, "The Department Deleted ;)");
  } catch (err) {
    next(err);
  }
};

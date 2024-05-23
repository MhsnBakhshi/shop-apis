const departmentSubModel = require("../../models/department-sub");
const departmentModel = require("../../models/department");
const mongoose = require("mongoose");
const { errResponses, succsessResponses } = require("../../utils/responses");

exports.departmentsSub = async (req, res, next) => {
  try {
    const { departmentID } = req.body;

    if (!mongoose.Types.ObjectId.isValid(departmentID)) {
      return errResponses(res, 409, "The departmentID Is Not Mongo ID ;(");
    }
    const departmentSub = await departmentSubModel
      .find({
        parent: departmentID,
      })
      .select("-__v -updatedAt -createdAt")
      .populate("parent", "title");

    if (!departmentSub) {
      return errResponses(res, 404, "The DepartmentSub Not Found From This ID ;(");
    }

    return succsessResponses(res, 200, departmentSub);
  } catch (err) {
    next(err);
  }
};
exports.create = async (req, res, next) => {
  try {
    const { departmentID, title } = req.body;

    if (!mongoose.Types.ObjectId.isValid(departmentID)) {
      return errResponses(res, 409, "The departmentID Is Not Mongo ID ");
    }
    const department = await departmentModel.findOne({ _id: departmentID });

    if (!department) {
      return errResponses(res, 404, "The Department Is Not Found ;(");
    }

    await departmentSubModel.create({ title, parent: departmentID });

    return succsessResponses(res, 201, "The DepartmentSub Created ;)");
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
    const edited = await departmentSubModel.findOneAndUpdate(
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
    const deleted = await departmentSubModel.findOneAndDelete({ _id: id });

    if (!deleted) {
      return errResponses(res, 404, "The Department Not Found ");
    }

    return succsessResponses(res, 200, "The Department Deleted ;)");
  } catch (err) {
    next(err);
  }
};

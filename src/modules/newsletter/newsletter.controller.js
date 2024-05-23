const newsletterModel = require("../../models/newsletter");
const { succsessResponses } = require("../../utils/responses");
exports.create = async (req, res, next) => {
  try {
    const { email } = req.body;

    await newsletterModel.create({ email });

    return succsessResponses(res, 200, "The Email Created ;)");
  } catch (err) {
    next(err);
  }
};

exports.getAll = async (req, res, next) => {
  try {
    const getEmails = await newsletterModel
      .find({})
      .select("-updatedAt -createdAt -__v")
      .lean();

    return succsessResponses(res, 200, getEmails);
  } catch (err) {
    next(err);
  }
};

const productModel = require("../../models/product");
const { errResponses, succsessResponses } = require("../../utils/responses");
exports.search = async (req, res, next) => {
  try {
    const searchedProducts = await productModel
      .find({
        $or: [
          { name: { $regex: ".*" + keyword + ".*" } },
          { href: { $regex: ".*" + keyword + ".*" } },
          { description: { $regex: ".*" + keyword + ".*" } },
        ],
      })
      .lean();

    if (!searchedProducts) {
      return errResponses(res, 404, "Not Found Anything To Show ;(");
    } else {
      return succsessResponses(res, 200, searchedProducts);
    }
  } catch (err) {
    next(err);
  }
};

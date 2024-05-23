const { errResponses, succsessResponses } = require("../../utils/responses");
const mongoose = require("mongoose");
const menuModel = require("../../models/menu");
exports.getAll = async (req, res, next) => {
  try {
    const menus = await menuModel
      .find({})
      .sort({ _is: -1 })
      .select("-__v ")
      .lean();

    let allMenus = [];

    menus.forEach((menu) => {
      let mainSubMenu = null;
      menus.forEach((subMenu) => {
        if (String(menu._id) === String(subMenu.parent)) {
          mainSubMenu = { ...subMenu };
        }
      });
      if (!menu.parent) {
        allMenus.push({
          ...menu,
          menu: menu.name,
          subMenu: mainSubMenu,
        });
      }
    });
    return succsessResponses(res, 200, allMenus);
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const { title, href, parent } = req.body;

    await menuModel.create({ title, parent, href });

    return succsessResponses(res, 201, "The Menu Created Successfully ;)");
  } catch (err) {
    next(err);
  }
};

exports.edit = async (req, res, next) => {
  try {
    const { menuID } = req.params;
    const { title, href, parent } = req.body;

    if (!mongoose.Types.ObjectId.isValid(menuID)) {
      return errResponses(res, 409, "The ID Is Not Valid !!");
    }
    const menu = await menuModel.findOne({ _id: menuID });

    if (!menu) {
      return errResponses(res, 404, "The Menu Not Found !!");
    }
    await menuModel.findOneAndUpdate({ _id: menuID }, { title, parent, href });

    return succsessResponses(res, 201, "The Menu Edited Successfully ;)");
  } catch (err) {
    next(err);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const { menuID } = req.params;

    if (!mongoose.Types.ObjectId.isValid(menuID)) {
      return errResponses(res, 409, "The ID Is Not Valid !!");
    }
    const menu = await menuModel.findOne({ _id: menuID });

    if (!menu) {
      return errResponses(res, 404, "The Menu Not Found !!");
    }
    await menuModel.findOneAndDelete({ _id: menuID });

    return succsessResponses(res, 200, "The Menu Deleted Successfully ;)");
  } catch (err) {
    next(err);
  }
};

exports.getAllForAdmin = async (req, res, next) => {
  try {
    const menus = await menuModel
      .find({})
      .sort({ _id: -1 })
      .select("-__v -createdAt -updatedAt")
      .populate("parent", "title href")
      .lean();

    if (!menus) {
      return errResponses(res, 404, "The Menu Not Found !!");
    } else {
      return succsessResponses(res, 201, menus);
    }
  } catch (err) {
    next(err);
  }
};

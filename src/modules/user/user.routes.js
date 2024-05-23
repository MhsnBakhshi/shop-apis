const express = require("express");
const controller = require("./user.controller");
const auth = require("../../middlewares/auth");
const isAdmin = require("../../middlewares/isAdmin");
const showValidateErr = require("../../middlewares/showValidationEror");
const { changeUserInfoSchema } = require("./user.validator");
const { multerStorage } = require("../../middlewares/uploader");
const uploader = multerStorage("public/profile");

const router = express.Router();

router
  .route("/")
  .get(auth, isAdmin, controller.getAll)
  .put(
    auth,
    changeUserInfoSchema(),
    showValidateErr,
    controller.changeUserInfo
  );

router.route("/change-role").put(auth, isAdmin, controller.changeRole);

router.route("/ban/:userID").delete(auth, isAdmin, controller.banUser);
router.route("/remove/:userID").delete(auth, isAdmin, controller.remove);

router
  .route("/profile")
  .post(auth, uploader.single("profile"), controller.setProfile)
  .delete(auth, controller.removeProfile)
module.exports = router;

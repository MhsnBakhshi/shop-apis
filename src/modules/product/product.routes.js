const express = require("express");
const controller = require("./product.controller");
const auth = require("../../middlewares/auth");
const isAdmin = require("../../middlewares/isAdmin");
const { multerStorage } = require("../../middlewares/uploader");
const showValidateErr = require("../../middlewares/showValidationEror");
const { productValidator } = require("./product.validator");
const uploader = multerStorage("public/cover");
const router = express.Router();

router
  .route("/")
  .post(auth, productValidator(), showValidateErr, controller.create)
  .get(controller.getAll);

router.route("/buy").post(auth, controller.buy);
router.route("/remove-basket").delete(auth, controller.removeProductFromBasket);
router.route("/basket").get(auth, controller.getUserBasketInfo);
router.route("/userBasket").get(auth, isAdmin, controller.getUserBasketsForAdmin);

router
  .route("/cover")
  .post(auth, uploader.single("cover"), controller.setCover)
  .delete(auth, controller.removeCover);

router
  .route("/edit")
  .put(auth, productValidator(), showValidateErr, controller.edit);

router.route("/saves").get(auth, controller.showAllSavesProduct);

router.route("/save/:productID").post(auth, controller.save);
router.route("/unsave/:productID").delete(auth, controller.unsave);

router.route("/like/:productID").post(auth, controller.like);
router.route("/dislike/:productID").delete(auth, controller.dislike);

router
  .route("/:productID")
  .delete(auth, controller.delete)
  .get(controller.getOne);

module.exports = router;

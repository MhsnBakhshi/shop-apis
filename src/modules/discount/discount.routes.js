const express = require("express");
const controller = require("./discount.controller");
const auth = require("../../middlewares/auth");
const isAdmin = require("../../middlewares/isAdmin");

const router = express.Router();

router
  .route("/")
  .post(auth, isAdmin, controller.create)
  .get(auth, isAdmin, controller.getAll);

router
  .route("/all")
  .put(auth, isAdmin, controller.setOnToAll)
  .delete(auth, isAdmin, controller.deleteAll);

router.route("/:code").get(auth, controller.getOne);

router.route("/one/:productID").put(auth, isAdmin, controller.setOn);
router.route("/edit/:discountID").put(auth, isAdmin, controller.edit);
router.route("/delete/:discountID").delete(auth, isAdmin, controller.deleteOne);

module.exports = router;

const express = require("express");
const controller = require("./category.controller");
const auth = require("../../middlewares/auth");
const isAdmin = require("../../middlewares/isAdmin");

const router = express.Router();

router.route("/").post(auth, isAdmin, controller.create).get(controller.getAll);

router
  .route("/:categoryID")
  .delete(auth, isAdmin, controller.delete)
  .put(auth, isAdmin, controller.edit);

module.exports = router;

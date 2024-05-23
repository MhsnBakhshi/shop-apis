const express = require("express");
const controller = require("./newsletter.controller");
const auth = require("../../middlewares/auth");
const isAdmin = require("../../middlewares/isAdmin");
const showValidateErr = require("../../middlewares/showValidationEror");
const { checkEmailSchema } = require("./newsletter.validator");

const router = express.Router();

router
  .route("/")
  .post(auth, controller.create)
  .get(auth, isAdmin, controller.getAll);

module.exports = router;

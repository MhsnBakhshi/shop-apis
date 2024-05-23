const express = require("express");
const controller = require("./auth.controller");
const showValidationEror = require("../../middlewares/showValidationEror");
const auth = require("../../middlewares/auth");
const {
  registerValidatorSchema,
  loginValidatorSchema,
  checkEmailSchema,
} = require("./auth.validator");
const router = express.Router();

router
  .route("/register")
  .post(registerValidatorSchema(), showValidationEror, controller.register);

router
  .route("/login")
  .post(loginValidatorSchema(), showValidationEror, controller.login);

router.route("/verifyOtp").post(controller.verifyOtp);

router.route("/refresh-token").post(controller.refreshToken);

router
  .route("/forget-password")
  .post(checkEmailSchema(), showValidationEror, controller.forgetPassword);

router.route("/reset-password").post(controller.resetPassword);
module.exports = router;

const express = require("express");
const controller = require("./contact.controller");
const auth = require("../../middlewares/auth");
const isAdmin = require("../../middlewares/isAdmin");
const showEror = require("../../middlewares/showValidationEror");
const { cantactValidatorSchema } = require("./contact.validator");

const router = express.Router();

router
  .route("/")
  .post(auth, cantactValidatorSchema(), showEror, controller.create);

router
  .route("/all")
  .get(auth, isAdmin, controller.getAll)
  .delete(auth, isAdmin, controller.removeAll);

router
  .route("/edit")
  .put(auth, cantactValidatorSchema(), showEror, controller.edit);
  
router.route("/answer/:id").post(auth, isAdmin, controller.answer);

router
  .route("/one/:id")
  .get(auth, isAdmin, controller.getOne)
  .delete(auth, isAdmin, controller.removeOne);

module.exports = router;

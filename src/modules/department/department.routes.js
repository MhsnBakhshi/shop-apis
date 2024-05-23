const express = require("express");
const departmentController = require("./department.controller");
const departmentSubController = require("./department-sub.controller");
const auth = require("../../middlewares/auth");
const isAdmin = require("../../middlewares/isAdmin");

const router = express.Router();

router
  .route("/")
  .post(auth, isAdmin, departmentController.create)
  .get(departmentController.departments)
  .put(auth, isAdmin, departmentController.edit)
  .delete(auth, isAdmin, departmentController.delete);

router
  .route("/sub")
  .get(departmentSubController.departmentsSub)
  .post(auth, isAdmin, departmentSubController.create)
  .put(auth, isAdmin, departmentSubController.edit)
  .delete(auth, isAdmin, departmentSubController.delete);

module.exports = router;

const express = require("express");
const controller = require("./comment.controller");
const auth = require("../../middlewares/auth");
const isAdmin = require("../../middlewares/isAdmin");
const router = express.Router();

router
  .route("/")
  .post(auth, controller.create)
  .get(auth, isAdmin, controller.getAllCommentsForAdmin);

router.route("/answer/:commentID").post(auth, isAdmin, controller.answer);
router.route("/accept/:commentID").put(auth, isAdmin, controller.accept);
router.route("/reject/:commentID").put(auth, isAdmin, controller.reject);

router
  .route("/:commentID")
  .delete(auth, isAdmin, controller.delete)
  .put(auth, isAdmin, controller.edit)
  .get(auth, isAdmin, controller.getOnCommentForAdmin);

module.exports = router;

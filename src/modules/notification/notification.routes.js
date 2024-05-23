const express = require("express");
const controller = require("./notification.controller");
const auth = require("../../middlewares/auth");
const isAdmin = require("../../middlewares/isAdmin");

const router = express.Router();

router
  .route("/")
  .post(auth, isAdmin, controller.send)
  .get(auth, isAdmin, controller.getAll);

router.route("/edit/:notificationID").put(auth, isAdmin, controller.edit);

router.route("/answer/:notificationID").post(auth, isAdmin, controller.answer);

router
  .route("/remove/:notificationID")
  .delete(auth, isAdmin, controller.deleteOne);

router.route("/seen/:notificationID").put(auth, isAdmin, controller.seen);

router.route("/count/:adminID").get(auth, isAdmin, controller.count);

router
  .route("/all/:adminID")
  .get(auth, isAdmin, controller.getNotificationsOfAdmin)
  .delete(auth, isAdmin, controller.deleteMany);

module.exports = router;

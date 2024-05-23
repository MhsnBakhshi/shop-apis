const express = require("express");
const controller = require("./ticket.controller");
const auth = require("../../middlewares/auth");
const isAdmin = require("../../middlewares/isAdmin");

const router = express.Router();

router
  .route("/")
  .post(auth, controller.create)
  .get(auth, isAdmin, controller.getAll);

router.route("/user").get(auth, controller.userTickets);

router.route("/answer").post(auth, isAdmin, controller.setAnswer);
router.route("/:id/answer").get(auth, controller.getAnswer);

module.exports = router;

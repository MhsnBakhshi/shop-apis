const express = require("express");
const controller = require("./menu.controller");
const auth = require("../../middlewares/auth");
const isAdmin = require("../../middlewares/isAdmin");

const router = express.Router();

router.route("/").get(controller.getAll).post(auth, isAdmin, controller.create);

router.route("/:menuID").put(auth, isAdmin, controller.edit);
router.route("/:menuID").delete(auth, isAdmin, controller.delete);
router.route("/all").get(auth, isAdmin, controller.getAllForAdmin);
module.exports = router;

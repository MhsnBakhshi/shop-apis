const express = require("express");

const controller = require("./search.controller");

const router = express.Router();

router.route("/:keyword").get(controller.search);
module.exports = router;

const express = require("express");
const swaggerUI = require("swagger-ui-express");
const swaggerApiDocument = require("./swagger.json");
const router = express.Router();

const swaggerOptions = { customCss: ".swagger-ui .topbar {display: none;}" };
router.use("/", swaggerUI.serve);
router.get("/", swaggerUI.setup(swaggerApiDocument, swaggerOptions));
module.exports = router;

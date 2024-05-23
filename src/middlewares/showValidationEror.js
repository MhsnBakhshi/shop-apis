const { validationResult } = require("express-validator");
validate = (req, res, next) => {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    const obj = {};

    result.errors.forEach((err) => {
      obj[err.path] = err.msg;
    });

    return res.json(obj);
  }
  next();
};

module.exports = validate;
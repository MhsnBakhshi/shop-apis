const { body } = require("express-validator");

const checkEmailSchema = () => {
  return [body("email").isEmail().withMessage("ایمیل وارد شده معتبر نمی‌باشد")];
};

module.exports = { checkEmailSchema };

const { body } = require("express-validator");

const changeUserInfoSchema = () => {
  return [
    body("name")
      .isString()
      .withMessage("لطفا نام را به شکل متن وارد کنید")
      .isLength({ min: 3, max: 15 })
      .withMessage("نام شما باید بین 3 تا 15 کاراکتر باشه"),

    body("username")
      .isString()
      .withMessage("لطفا نام کاربری را به شکل متن وارد کنید")
      .isLength({ min: 8, max: 24 })
      .withMessage("نام کاربری باید بین 8 تا 24 کاراکتر باشه"),

    body("email").isEmail().withMessage("ایمیل وارد شده معتبر نمی‌باشد"),
  ];
};

module.exports = {
  changeUserInfoSchema,
};

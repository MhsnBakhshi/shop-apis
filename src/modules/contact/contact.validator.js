const { body } = require("express-validator");

const cantactValidatorSchema = () => {
  return [
    body("text")
      .isString()
      .withMessage("لطفا  متن را به شکل متن وارد کنید")
      .isLength({ max: 200 })
      .withMessage("متن نباید بیشتر از 200 کاراکتر باشه"),

    body("name")
      .isString()
      .withMessage("لطفا  تام را به شکل متن وارد کنید")
      .isLength({ min: 3, max: 15 })
      .withMessage("نام شما باید بین 3 تا 15 کاراکتر باشه"),

    body("email").isEmail().withMessage("ایمیل وارد شده معتبر نمی‌باشد"),

    body("phone")
      .isMobilePhone(["fa-IR"])
      .withMessage("شماره تماس وارد شده معتبر نمی‌باشد"),
  ];
};

module.exports = {
  cantactValidatorSchema,
};

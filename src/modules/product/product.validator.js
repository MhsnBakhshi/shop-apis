const { body } = require("express-validator");

const productValidator = () => {
  return [
    body("name")
      .isString()
      .withMessage("لطفا نام را به شکل متن وارد کنید")
      .isLength({ min: 7, max: 25 })
      .withMessage("نام شما باید بین 10 تا 25 کاراکتر باشه"),

    body("description")
      .isString()
      .withMessage("لطفا  توضیحات را به شکل متن وارد کنید")
      .isLength({ max: 50 })
      .withMessage("توضیحات باید بین 15 تا 45 کاراکتر باشه"),
  ];
};

module.exports = {
  productValidator,
};

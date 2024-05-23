const { body } = require("express-validator");

const commentBodyValidator = () => {
  return [
    ,
    body("body")
      .isString()
      .withMessage("لطفا  نظر را به شکل متن وارد کنید")
      .isLength({ max: 200 })
      .withMessage("توضیحات نباید بیشتر از 200 کاراکتر باشه"),
  ];
};

module.exports = {
  commentBodyValidator,
};

const userModel = require("../models/User");
const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  const authHeader = req.header("Authorization")?.split(" ");

  if (authHeader?.length !== 2) {
    return res.status(403).json({
      message: "شما به این API دسترسی ندارید !!",
    });
  }

  const token = authHeader[1];

  try {
    const jwtPayload = jwt.verify(token, process.env.JWT_SECRET);

    const user = await userModel.findById(jwtPayload.userID).lean();

    if (!user) {
      return res.json({ message: "The User Not Found With token" });
    }
    Reflect.deleteProperty(user, "password");

    req.user = user;
    next();
  } catch (error) {
    return res.json(error);
  }
};

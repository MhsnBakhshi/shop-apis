const userModel = require("../../models/User");
const banUserModel = require("../../models/ban");
const Kavenegar = require("kavenegar");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");
const nodeMailer = require("nodemailer");
const otpModel = require("../../models/Otp");
const refreshTokenModel = require("../../models/refreshToken");
const resetPasswordModel = require("../../models/resetPasswordModel");
const { errResponses, succsessResponses } = require("../../utils/responses");

exports.register = async (req, res, next) => {
  try {
    const { username, name, email, password, phone } = req.body;

    const isUserExists = await userModel
      .findOne({
        $or: [{ email }, { username }],
      })
      .lean();

    if (isUserExists) {
      return errResponses(
        res,
        400,
        "The User Already Registered With Email Or Usersname"
      );
    }

    const isUserBan = await banUserModel.findOne({ phone });

    if (isUserBan) {
      return errResponses(res, 403, "The User Phone Was Banned");
    }

    const usersCount = await userModel.countDocuments();
    const user = await userModel.create({
      username,
      name,
      email,
      password,
      phone,
      role: usersCount > 0 ? "USER" : "ADMIN",
    });
    const accessToken = jwt.sign({ userID: user._id }, process.env.JWT_SECRET, {
      expiresIn: "15s",
    });

    const newUser = user.toObject();
    Reflect.deleteProperty(newUser, "password");

    return succsessResponses(res, 201, "The User Registered SuccessFully :))", {
      newUser,
      accessToken,
    });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { phone } = req.body;

    const user = await userModel.findOne({ phone }).lean();

    if (!user) {
      return errResponses(
        res,
        409,
        "The User Not Registerd With This Phone Number"
      );
    }
    const getCodeCount = await otpModel.find({ phone }).count().lean();

    if (getCodeCount === 2) {
      setTimeout(async () => {
        await otpModel.deleteMany({ phone });
      }, 900000);
      return errResponses(
        res,
        406,
        "You Can Ony try 3 Times To Send Code, Wait 15Min For Try Agian !!"
      );
    } else {
      const code = Math.floor(Math.random() * 99999);
      const setKevenegarApiKey = Kavenegar.KavenegarApi({
        apikey: process.env.KAVENEGAR_API_KEY,
      });
      setKevenegarApiKey.VerifyLookup({
        receptor: phone,
        token: code,
        template: process.env.KAVENEGAR_TEMPLATE,
      });

      let expireAt = new Date(Date.now() + 3 * 60 * 1000);
      await otpModel.create({
        code,
        phone,
        expireAt,
      });
      return succsessResponses(res, 200, "OTP Code Sent ...");
    }
  } catch (err) {
    next(err);
  }
};

exports.verifyOtp = async (req, res, next) => {
  try {
    const { phone, code } = req.body;

    const otp = await otpModel
      .findOneAndUpdate(
        { phone },
        {
          $inc: {
            uses: 1,
          },
        }
      )
      .sort({ _id: -1 })
      .lean();

    if (otp) {
      const date = new Date();
      const now = date.getTime();

      if (otp.expireAt < now) {
        return errResponses(res, 410, "Code Is Expired !!");
      }

      if (otp.uses > 3) {
        return errResponses(res, 408, "Code Is Max Used, Try Agian !!");
      }
      if (otp.code !== code) {
        return errResponses(res, 409, "Code Is Not Correct !!");
      }

      await otpModel.deleteMany({ phone });
      const user = await userModel.findOne({ phone }).lean();
      const refreshToken = await refreshTokenModel.createToken(user);
      const accessToken = jwt.sign(
        { userID: user._id },
        process.env.JWT_SECRET,
        {
          expiresIn: "15s",
        }
      );
      res.cookie("access-token", accessToken, {
        maxAge: 900_000,
        httpOnly: true,
      });
      res.cookie("refresh-token", refreshToken, {
        maxAge: 900_000,
        httpOnly: true,
      });
      return succsessResponses(res, 200, "Code Is Correct ;)", accessToken);
    } else {
      return errResponses(res, 409, "Code Is Not Correct !!");
    }
  } catch (err) {
    next(err);
  }
};

exports.refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    const userID = await refreshTokenModel.verifyToken(refreshToken);
    if (!userID) {
      return errResponses(res, 401, "There Is No RefreshToken!!");
    }
    const user = await userModel.findOne({ _id: userID });

    if (!userID) {
      return errResponses(res, 401, "There Is No RefreshToken!!");
    }
    const newRefreshToken = await refreshTokenModel.createToken(user);
    const accessToken = jwt.sign({ userID: user._id }, process.env.JWT_SECRET, {
      expiresIn: "15s",
    });
    res.cookie("access-token", accessToken, {
      maxAge: 900_000,
      httpOnly: true,
    });
    res.cookie("refresh-token", newRefreshToken, {
      maxAge: 900_000,
      httpOnly: true,
    });
    return succsessResponses(res, 200, `New AccessToken ${accessToken}`);
  } catch (err) {
    next(err);
  }
};

exports.forgetPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await userModel.findOne({ email });

    if (!user) {
      return succsessResponses(
        res,
        404,
        "There Is No User With This Email!! Check Email ...."
      );
    }
    const resetToken = uuidv4();

    const resetPasswordDate = Date.now() + 1000 * 60 * 60; //* 1 hour

    await resetPasswordModel.create({
      user: user._id,
      token: resetToken,
      expire: resetPasswordDate,
    });

    const transport = nodeMailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SENDER_EMAIL,
        pass: process.env.SENDER_EMAIL_PASS,
      },
    });

    const emailOption = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "Reset Your Password",
      html: `
      <h2> Hi, ${user.name} 🖐, Please Click on ResetPassword to reset your password </h2>
      <a href=http://localhost:${process.env.PORT}/auth/resetPassword/${resetToken}>Reset Password</a>
      `,
    };
    transport.sendMail(emailOption);

    return succsessResponses(
      res,
      200,
      `The ResetPassword Link Sent To ${email}. Please Check Your EmailBox`
    );
  } catch (err) {
    next(err);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;

    const resetPassword = await resetPasswordModel.findOne({
      token,
      expire: { $gt: Date.now() },
    });
    if (!resetPassword) {
      return errResponses(
        res,
        409,
        "The Token Time Is Expired Or There Is No Token That You Sent In DB !!"
      );
    }

    const user = await userModel.findOne({ _id: resetPassword.user });

    if (!user) {
      return errResponses(
        res,
        404,
        "The Time Is Expired Or There Is No Token With This User !!"
      );
    }

    const hashedPassword = await bcrypt.hash(password, 11);

    await userModel.findOneAndUpdate(
      { _id: user._id },
      { password: hashedPassword }
    );
    await resetPasswordModel.findOneAndDelete({ _id: resetPassword._id });

    return succsessResponses(res, 200, "The Password Reseted SuccessFully ;)");
  } catch (err) {
    next(err);
  }
};

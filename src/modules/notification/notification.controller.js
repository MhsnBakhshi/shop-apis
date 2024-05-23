const notificationModel = require("../../models/notification");
const { errResponses, succsessResponses } = require("../../utils/responses");
const mongoose = require("mongoose");
exports.send = async (req, res, next) => {
  try {
    const { message, adminID } = req.body;

    if (!mongoose.Types.ObjectId.isValid(adminID)) {
      return errResponses(res, 409, "The AdminID Is Not Valid ;(");
    }

    await notificationModel.create({
      message,
      admin: adminID,
    });
    return succsessResponses(res, 201, "The Notification Sent ;)");
  } catch (err) {
    next(err);
  }
};

exports.getAll = async (req, res, next) => {
  try {
    const notifications = await notificationModel
      .find({})
      .populate("admin", "name username profile email phone")
      .select("-createdAt -updatedAt -__v")
      .lean();

    let allNotifications = [];

    notifications.forEach((notification) => {
      let mainNotificationAnswerInfo = null;
      notifications.forEach((answerNotification) => {
        if (String(notification._id) === String(answerNotification.answerID)) {
          mainNotificationAnswerInfo = { ...answerNotification };
        }
      });
      if (!notification.answerID) {
        allNotifications.push({
          ...notification,
          answerNotification: mainNotificationAnswerInfo,
        });
      }
    });
    if (!notifications.length) {
      return errResponses(res, 404, "There Is No Notification ;(");
    } else {
      return succsessResponses(res, 200, allNotifications);
    }
  } catch (err) {
    next(err);
  }
};

exports.getNotificationsOfAdmin = async (req, res, next) => {
  try {
    const { adminID } = req.params;

    if (!mongoose.Types.ObjectId.isValid(adminID)) {
      return errResponses(res, 409, "The AdminID Is Not Valid ;(");
    }
    const adminNotifications = await notificationModel
      .find({ admin: adminID })
      .select("-createdAt -updatedAt -__v")
      .populate("admin", "name username profile email phone")
      .lean();

    if (!adminNotifications.length) {
      return errResponses(
        res,
        404,
        "There Is No Notification From This Admin, Empity !!"
      );
    }

    let allNotifications = [];

    adminNotifications.forEach((notification) => {
      let mainNotificationAnswerInfo = null;
      adminNotifications.forEach((answerNotification) => {
        if (String(notification._id) === String(answerNotification.answerID)) {
          mainNotificationAnswerInfo = { ...answerNotification };
        }
      });
      if (!notification.answerID) {
        allNotifications.push({
          ...notification,
          answerNotification: mainNotificationAnswerInfo,
        });
      }
    });

    return succsessResponses(res, 200, allNotifications);
  } catch (err) {
    next(err);
  }
};

exports.deleteMany = async (req, res, next) => {
  try {
    const { adminID } = req.params;

    if (!mongoose.Types.ObjectId.isValid(adminID)) {
      return errResponses(res, 409, "The AdminID Is Not Valid ;(");
    }

    const deletedNotifications = await notificationModel.deleteMany({
      admin: adminID,
    });

    if (deletedNotifications.deletedCount === 0) {
      return errResponses(
        res,
        404,
        "There Is No Notification From This Admin, Empity !!"
      );
    }

    return succsessResponses(res, 200, "The Notifications Deleted ;)");
  } catch (err) {
    next(err);
  }
};

exports.deleteOne = async (req, res, next) => {
  try {
    const { notificationID } = req.params;

    if (!mongoose.Types.ObjectId.isValid(notificationID)) {
      return errResponses(res, 409, "The notificationID Is Not Valid ;(");
    }

    const deletedNotification = await notificationModel.findOneAndDelete({
      _id: notificationID,
    });
    if (!deletedNotification) {
      return errResponses(
        res,
        404,
        "There Is No Notification From This Admin, Empity !!"
      );
    }
    return succsessResponses(res, 200, "The Notification Deleted ;)");
  } catch (err) {
    next(err);
  }
};

exports.edit = async (req, res, next) => {
  try {
    const { notificationID } = req.params;
    const { message, adminID } = req.body;

    if (
      !mongoose.Types.ObjectId.isValid(notificationID) ||
      !mongoose.Types.ObjectId.isValid(adminID)
    ) {
      return errResponses(
        res,
        409,
        "The ID Is Not Valid ;(, Check notificationID or adminID"
      );
    }
    await notificationModel.findOneAndUpdate(
      { _id: notificationID },
      { message, admin: adminID }
    );
    return succsessResponses(res, 200, "The Notification Edited ;)");
  } catch (err) {
    next(err);
  }
};
exports.answer = async (req, res, next) => {
  try {
    const { notificationID } = req.params;
    const { message } = req.body;

    if (!mongoose.Types.ObjectId.isValid(notificationID)) {
      return errResponses(res, 409, "The notificationID Is Not Valid ;(");
    }
    const notification = await notificationModel.findOne({
      _id: notificationID,
    });

    if (!notification) {
      return errResponses(res, 404, "The Notification Not Found !!");
    }

    await notificationModel.create({
      admin: notification.admin,
      answerID: notification._id,
      message,
    });

    return succsessResponses(res, 201, "The Notification Answered ;)");
  } catch (err) {
    next(err);
  }
};

exports.seen = async (req, res, next) => {
  try {
    const { notificationID } = req.params;

    if (!mongoose.Types.ObjectId.isValid(notificationID)) {
      return errResponses(res, 409, "The notificationID Is Not Valid ;(");
    }

    const editedNotification = await notificationModel.findOneAndUpdate(
      { _id: notificationID },
      { seen: 1 }
    );
    if (!editedNotification) {
      return errResponses(res, 404, "The Notification Not Found !!");
    }
    return succsessResponses(res, 201, "The Notification Was Seen ;)");
  } catch (err) {
    next(err);
  }
};
exports.count = async (req, res, next) => {
  try {
    const { adminID } = req.params;

    if (!mongoose.Types.ObjectId.isValid(adminID)) {
      return errResponses(res, 409, "The AdminID Is Not Valid ;(");
    }
    const count = await notificationModel
      .find({ admin: adminID })
      .countDocuments()
      .lean();

    return succsessResponses(res, 200, `${count ? count : "Empity"}`);
  } catch (err) {
    next(err);
  }
};

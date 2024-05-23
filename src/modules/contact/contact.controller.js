const contactModel = require("../../models/contact");
const mongoose = require("mongoose");
const nodeMailer = require("nodemailer");
const { errResponses, succsessResponses } = require("../../utils/responses");
exports.create = async (req, res, next) => {
  try {
    const { name, text, phone, email } = req.body;

    await contactModel.create({ name, email, text, phone, answer: 0 });

    return succsessResponses(res, 201, "The Contact Created ;)");
  } catch (err) {
    next(err);
  }
};

exports.getAll = async (req, res, next) => {
  try {
    const contacts = await contactModel
      .find({})
      .select("-__v -updatedAt -createdAt")
      .lean();

    if (!contacts) {
      return errResponses(res, 404, "The Comtact List Is Empity ;(");
    }
    return succsessResponses(res, 200, contacts);
  } catch (err) {
    next(err);
  }
};

exports.getOne = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return errResponses(res, 409, "The ID Is Not Valid :(");
    }

    const contact = await contactModel
      .findOne({ _id: id })
      .select("-__v -updatedAt -createdAt")
      .lean();

    if (!contact) {
      return errResponses(res, 404, "The Contact Not Found:(");
    }

    return succsessResponses(res, 200, contact);
  } catch (err) {
    next(err);
  }
};
exports.edit = async (req, res, next) => {
  try {
    const { name, text, phone, email, id } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return errResponses(res, 409, "The ID Is Not Valid :(");
    }

    const editedContact = await contactModel.findOneAndUpdate(
      { _id: id },
      { name, text, email, phone }
    );

    if (!editedContact) {
      return errResponses(res, 404, "The Contact Not Found ;(");
    }

    return succsessResponses(res, 200, "The Contact Info Edited ;)");
  } catch (err) {
    next(err);
  }
};
exports.removeAll = async (req, res, next) => {
  try {
    await contactModel.deleteMany();

    return succsessResponses(res, 200, "All Contacts List Deleted ;)");
  } catch (err) {
    next(err);
  }
};

exports.removeOne = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return errResponses(res, 409, "The ID Is Not Valid :(");
    }
    const deletedContact = await contactModel.findOneAndDelete({ _id: id });

    if (!deletedContact) {
      return errResponses(res, 404, "The Contact Not Found :(");
    }

    return succsessResponses(res, 200, "The Contact Deleted ;)");
  } catch (err) {
    next(err);
  }
};

exports.answer = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { answer, subject } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return errResponses(res, 409, "The ID Is Not Valid :(");
    }

    const contact = await contactModel.findOne({ _id: id });

    if (!contact) {
      return errResponses(res, 404, "The Contact Not Found ;(");
    } else {
      const transport = nodeMailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.SENDER_EMAIL,
          pass: process.env.SENDER_EMAIL_PASS,
        },
      });

      const emailOptions = {
        from: process.env.SENDER_EMAIL,
        to: contact.email,
        subject,
        text: `Message: ${contact.text}\nAnswer: ${answer}`,
      };
      transport.sendMail(emailOptions, async (err, info) => {
        if (err) {
          return errResponses(res, err.statusCode, err);
        } else {
          await contactModel.findOneAndUpdate(
            { email: contact.email },
            { answer: 1 }
          );
        }
      });

      return succsessResponses(res, 200, "Answer Sent To Email Of User ;)");
    }
  } catch (err) {
    next(err);
  }
};

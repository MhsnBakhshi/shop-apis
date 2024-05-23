const ticketModel = require("../../models/ticket");
const departmentModel = require("../../models/department");
const productModel = require("../../models/product");
const departmentSubModel = require("../../models/department-sub");
const { errResponses, succsessResponses } = require("../../utils/responses");
const mongoose = require("mongoose");
exports.create = async (req, res, next) => {
  try {
    const { departmentID, departmentSubID, title, body, product } = req.body;

    if (
      !mongoose.Types.ObjectId.isValid(departmentID) ||
      !mongoose.Types.ObjectId.isValid(departmentSubID) ||
      !mongoose.Types.ObjectId.isValid(product)
    ) {
      return errResponses(
        res,
        409,
        "departmentSubID Or departmentID Or product Is Not Mongo ID ;("
      );
    }

    const isDepartment = !!(await departmentModel.findOne({
      _id: departmentID,
    }));
    const isDepartmentSub = !!(await departmentSubModel.findOne({
      _id: departmentSubID,
    }));
    const isProduct = !!(await productModel.findOne({ _id: product }));

    if (!isDepartment || !isDepartmentSub || !isProduct) {
      return errResponses(
        res,
        404,
        "departmentSubID Or departmentID Or Product Not Found;("
      );
    }
    const addedTicketToDB = await ticketModel.create({
      departmentID,
      departmentSubID,
      title,
      body,
      product,
      answer: 0,
      isAnswer: 0,
      user: req.user._id,
    });

    const ticket = await ticketModel
      .findOne({ _id: addedTicketToDB._id })
      .select("-createdAt -updatedAt -__v")
      .populate({
        path: "departmentSubID",
        select: "-createdAt -updatedAt -__v",
        populate: {
          path: "parent",
          model: "Department",
          select: "-createdAt -updatedAt -__v",
        },
      })
      .populate("departmentID", "title")
      .populate("user", "name username email profile phone")
      .lean();

    return succsessResponses(res, 201, "The Ticket Created ;)", ticket);
  } catch (err) {
    next(err);
  }
};

exports.getAll = async (req, res, next) => {
  try {
    const tickets = await ticketModel
      .find({ answer: 0 })
      .select("-createdAt -updatedAt -__v")
      .populate({
        path: "departmentSubID",
        select: "-createdAt -updatedAt -__v",
        populate: {
          path: "parent",
          model: "Department",
          select: "-createdAt -updatedAt -__v",
        },
      })
      .populate("departmentID", "title")
      .populate("user", "name username email profile phone")
      .lean();

    let allTicketss = [];

    tickets.forEach((ticket) => {
      let mainTicketAnswerInfo = null;
      tickets.forEach((answerTicket) => {
        if (String(ticket._id) === String(answerTicket.parent)) {
          mainTicketAnswerInfo = { ...answerTicket };
        }
      });
      if (!ticket.parent) {
        allTicketss.push({
          ...ticket,
          answerTicket: mainTicketAnswerInfo,
        });
      }
    });

    if (!tickets) {
      return errResponses(res, 404, "The Ticket List Is Empity");
    } else {
      return succsessResponses(res, 200, allTicketss);
    }
  } catch (err) {
    next(err);
  }
};

exports.userTickets = async (req, res, next) => {
  try {
    const userTickets = await ticketModel
      .find({ user: req.user._id })
      .sort({ _id: -1 })
      .populate("departmentID", "title")
      .populate("departmentSubID", "title")
      .populate("user", "name username email phone profile")
      .select("-createdAt -updatedAt -__v")
      .lean();

    if (!userTickets) {
      return errResponses(res, 404, "The UserTicket List Is Empity");
    } else {
      return succsessResponses(res, 200, userTickets);
    }
  } catch (err) {
    next(err);
  }
};

exports.setAnswer = async (req, res, next) => {
  try {
    const { body, ticketID } = req.body;

    if (!mongoose.Types.ObjectId.isValid(ticketID)) {
      return errResponses(res, 409, "The Ticket ID Is Not Valid ;(");
    }
    const ticket = await ticketModel.findOne({ _id: ticketID }).lean();

    if (!ticket) {
      return errResponses(res, 404, "The Ticket Not Found ;(");
    }
    await ticketModel.create({
      title: "پاسخ تیکت شما: ",
      body,
      departmentID: ticket.departmentID,
      departmentSubID: ticket.departmentSubID,
      user: req.user._id,
      answer: 0,
      parent: ticketID,
      isAnswer: 1,
    });
    await ticketModel.findOneAndUpdate(
      { _id: ticketID },
      {
        answer: 1,
      }
    );

    return succsessResponses(res, 200, "The Ticket Answered :)");
  } catch (err) {
    next(err);
  }
};

exports.getAnswer = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return errResponses(res, 409, "The ID Is Not Valid ;(");
    }

    const ticket = await ticketModel
      .findOne({ _id: id })
      .populate("user", "name username email phone prodile")
      .select("title body answer isAnswer")
      .lean();
    const mainTicket = await ticketModel
      .findOne({ parent: id })
      .populate("user", "name username email phone prodile")
      .populate("parent", "title body")
      .select("title body answer isAnswer")
      .lean();

    if (!ticket) {
      return errResponses(res, 404, "The Ticket Not Found ;(");
    }

    return succsessResponses(res, 200, {
      ticket,
      mainTicket: mainTicket ? mainTicket : null,
    });
  } catch (err) {
    next(err);
  }
};

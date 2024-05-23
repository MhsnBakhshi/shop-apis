const errResponses = (res, statusCode, message) => {
  return res
    .status(statusCode)
    .json({ status: statusCode, succsess: false, message });
};

const succsessResponses = (res, statusCode, message, data) => {
  return res
    .status(statusCode)
    .json({ status: statusCode, succsess: true, message, data });
};

module.exports = {
  succsessResponses,
  errResponses,
};

const { Http400 } = require("./errors");
module.exports = function errorHandler(err, req, res, next) {
  if (err instanceof Http400) {
    return res.status(400).json({
      code: 400,
      reason: "Bad Request",
      message: err.message,
    });
  }
  return next(err);
};

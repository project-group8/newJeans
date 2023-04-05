const logger = require("./logger.js");

const errorLogger = (error, request, response, next) => {
  logger.error(err.stack);
  next(error); // errorLogger -> errorHandler
};

const errorHandler = (error, req, res, next) => {
  return res.status(error.output.payload.statusCode || 500).json({
    errorMessage: error.output.payload.message || "서버 에러가 발생했습니다.",
  });
};

module.exports = { errorLogger, errorHandler };

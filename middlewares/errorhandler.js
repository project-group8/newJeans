
  module.export = (err, req, res, next) => {
    logger.error(err.stack);
    return res.status(err.output.payload.statusCode || 500).json({
      errorMessage: err.output.payload.message || "서버 에러가 발생했습니다.",
    });
  };

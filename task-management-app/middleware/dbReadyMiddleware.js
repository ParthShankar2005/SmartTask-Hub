const mongoose = require("mongoose");

const dbReadyMiddleware = (_req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      message: "Service temporarily unavailable. Database connection is not ready. Please retry shortly.",
    });
  }

  return next();
};

module.exports = dbReadyMiddleware;

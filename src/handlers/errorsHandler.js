const { NODE_ENV } = require("../config/env");
const sequelizeErrorHandler = require("./sequelizeErrorHandler");
const { handleJWTError, handleJWTExpiredError } = require("./jwtErrorHandler");
const logger = require("../logging/index");

// Note: Sequelize Error Handler Not implemented yet

const sendErrorDev = (err, req, res) => {
  // A) API
  if (req.originalUrl.startsWith("/api")) {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  }
};

const sendErrorProd = (err, req, res) => {
  // A) API
  if (req.originalUrl.startsWith("/api")) {
    // A) Operational, trusted error: send message to client
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }
    // B) Programming or other unknown error: don't leak error details
    // 1) Log error
    logger.error("ERROR 💥", err);
    // 2) Send generic message
    return res.status(500).json({
      status: "error",
      message: "Something went very wrong!",
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (NODE_ENV === "development") {
    sendErrorDev(err, req, res);
  } else if (NODE_ENV === "production") {
    // check if below line is required
    // let error = { ...err, message: err.message, name: err.name };
    if (err.name === "SequelizeUniqueConstraintError") {
      err = sequelizeErrorHandler.handleDuplicateFieldsDB(err);
    }
    if (err.name === "SequelizeValidationError") {
      err = sequelizeErrorHandler.handleValidationErrorDB(err);
    }
    if (err.name === "SequelizeForeignKeyConstraintError") {
      err = sequelizeErrorHandler.handleFKConstraintError(err);
    }
    if (err.name === "JsonWebTokenError") err = handleJWTError();
    if (err.name === "TokenExpiredError") err = handleJWTExpiredError();

    sendErrorProd(err, req, res);
  }
};

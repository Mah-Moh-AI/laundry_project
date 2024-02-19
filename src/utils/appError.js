const logger = require("../logging/index");
const { t } = require("./npmPackages").i18next;

class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? t("fail") : t("error");
    this.isOperational = true;
    logger.error(this); // to be checked
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;

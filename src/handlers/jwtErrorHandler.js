// utils
const AppError = require("../utils/appError");

// JWT errors handeling
exports.handleJWTError = () =>
  new AppError("Invalid token. Please log in again!", 401);

exports.handleJWTExpiredError = () =>
  new AppError("Your token has expired! Please log in again.", 401);

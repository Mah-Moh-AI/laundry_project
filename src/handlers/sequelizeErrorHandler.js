// utils
const AppError = require("../utils/appError");

// Sequelize errors handeling

// handle Duplicatation Error in DB
exports.handleDuplicateFieldsDB = (err) => {
  const value = Object.keys(err.fields).join(", ");

  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new AppError(message, 400);
};

// handle Validation Error in DB
exports.handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);

  const message = `Invalid input data. ${errors.join(". ")}`;
  return new AppError(message, 400);
};

exports.handleFKConstraintError = (err) => {
  const value = err.fields;
  const message = `Unavailable Foreign Key field value: ${value}. Please use another value!`;
  return new AppError(message, 400);
};

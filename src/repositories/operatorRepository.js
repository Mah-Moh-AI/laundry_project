const Operator = require("../models/operatorModel");
const AppError = require("../utils/appError");
const logger = require("../logging/index");

// Synchronize the User model with the database
// Operator.sync({ force: false, alter: false })
//   .then(() => {
//     logger.info("Operator table created (if not exists) successfully");
//   })
//   .catch((error) => {
//     logger.error("Error creating Operator table:", error);
//     return new AppError("Error creating Operator table", 500);
//   })();

// CRUD operations
exports.getAllOperators = async () => {
  return await Operator.scope("active").findAll();
};

exports.createOperator = async (data) => {
  return await Operator.create(data);
};

exports.getOperator = async (id) => {
  return await Operator.findByPk(id);
};

exports.updateOperator = async (id, data) => {
  return await Operator.update(data, {
    where: { id },
  });
};

exports.deleteOperator = async (id) => {
  return await Operator.update(
    { deletedAt: Date.now() },
    {
      where: { id },
    }
  );
};

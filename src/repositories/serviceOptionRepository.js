const ServiceOption = require("../models/serviceOptionModel");
const AppError = require("../utils/appError");
const logger = require("../logging/index");

// Synchronize the User model with the database
ServiceOption.sync({ force: false, alter: false })
  .then(() => {
    logger.info("ServiceOption table created (if not exists) successfully");
  })
  .catch((error) => {
    logger.error("Error creating ServiceOption table:", error);
    return new AppError("Error creating ServiceOption table", 500);
  });

// CRUD operations
exports.getAllServiceOptions = async (query) => {
  return await ServiceOption.scope("active").findAll(query);
};

exports.createServiceOption = async (data) => {
  return await ServiceOption.create(data);
};

exports.getServiceOption = async (id, attributes) => {
  return await ServiceOption.findByPk(id, { attributes });
};

exports.updateServiceOption = async (id, data) => {
  return await ServiceOption.update(data, {
    where: { id },
    individualHooks: true,
  });
};

exports.deleteServiceOption = async (id) => {
  return await ServiceOption.update(
    { deletedAt: Date.now() },
    {
      where: { id },
      individualHooks: true,
    }
  );
};

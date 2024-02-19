const Service = require("../models/serviceModel");
const AppError = require("../utils/appError");
const logger = require("../logging/index");

// Synchronize the User model with the database
Service.sync({ force: false, alter: false })
  .then(() => {
    logger.info("Service table created (if not exists) successfully");
  })
  .catch((error) => {
    logger.error("Error creating Service table:", error);
    return new AppError("Error creating Service table", 500);
  });

// CRUD operations
exports.getAllServices = async (query) => {
  return await Service.scope("active").findAll(query);
};

exports.createService = async (data) => {
  return await Service.create(data);
};

exports.getService = async (id, attributes) => {
  return await Service.findByPk(id, { attributes });
};

exports.updateService = async (id, data) => {
  return await Service.update(data, {
    where: { id },
    individualHooks: true,
  });
};

exports.deleteService = async (id) => {
  return await Service.update(
    { deletedAt: Date.now() },
    {
      where: { id },
      individualHooks: true,
    }
  );
};

const ServicePreference = require("../models/servicePreferenceModel");
const AppError = require("../utils/appError");
const logger = require("../logging/index");

// Synchronize the User model with the database
ServicePreference.sync({ force: false, alter: false })
  .then(() => {
    logger.info("ServicePreference table created (if not exists) successfully");
  })
  .catch((error) => {
    logger.error("Error creating ServicePreference table:", error);
    return new AppError("Error creating ServicePreference table", 500);
  });

// CRUD operations
exports.getAllServicePreferences = async (query) => {
  return await ServicePreference.scope("active").findAll(query);
};

exports.createServicePreference = async (data) => {
  return await ServicePreference.create(data);
};

exports.getServicePreference = async (id, attributes) => {
  return await ServicePreference.findByPk(id, { attributes });
};

exports.updateServicePreference = async (id, data) => {
  return await ServicePreference.update(data, {
    where: { id },
    individualHooks: true,
  });
};

exports.deleteServicePreference = async (id) => {
  return await ServicePreference.update(
    { deletedAt: Date.now() },
    {
      where: { id },
      individualHooks: true,
    }
  );
};

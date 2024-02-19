const Location = require("../models/locationModel");
const AppError = require("../utils/appError");
const logger = require("../logging/index");

// Synchronize the User model with the database
Location.sync({ force: false, alter: false })
  .then(() => {
    logger.info("Location table created (if not exists) successfully");
  })
  .catch((error) => {
    logger.error("Error creating Location table:", error);
    return new AppError("Error creating Location table", 500);
  });

// CRUD operations
exports.getAllLocations = async (query) => {
  return await Location.scope("active").findAll(query);
};

exports.createLocation = async (data) => {
  return await Location.create(data);
};

exports.getLocation = async (id, attributes) => {
  return await Location.findByPk(id, { attributes });
};

exports.updateLocation = async (id, data) => {
  return await Location.update(data, {
    where: { id },
    individualHooks: true,
  });
};

exports.deleteLocation = async (id) => {
  return await Location.update(
    { deletedAt: Date.now() },
    {
      where: { id },
      individualHooks: true,
    }
  );
};

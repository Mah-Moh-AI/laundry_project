const DeliveryType = require("../models/deliveryTypeModel");
const AppError = require("../utils/appError");
const logger = require("../logging/index");

// Synchronize the User model with the database
DeliveryType.sync({ force: false, alter: false })
  .then(() => {
    logger.info("DeliveryType table created (if not exists) successfully");
  })
  .catch((error) => {
    logger.error("Error creating DeliveryType table:", error);
    return new AppError("Error creating DeliveryType table", 500);
  });

// CRUD operations
exports.getAllDeliveryTypes = async (query) => {
  return await DeliveryType.scope("active").findAll(query);
};

exports.createDeliveryType = async (data) => {
  return await DeliveryType.create(data);
};

exports.getDeliveryType = async (id, attributes) => {
  return await DeliveryType.scope("active").findByPk(id, { attributes });
};

exports.updateDeliveryType = async (id, data) => {
  return await DeliveryType.update(data, {
    where: { id },
    individualHooks: true,
  });
};

exports.deleteDeliveryType = async (id) => {
  return await DeliveryType.update(
    { deletedAt: Date.now() },
    {
      where: { id },
      individualHooks: true,
    }
  );
};

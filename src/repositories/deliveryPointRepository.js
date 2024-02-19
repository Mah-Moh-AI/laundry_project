const DeliveryPoint = require("../models/deliveryPointModel");
const AppError = require("../utils/appError");
const logger = require("../logging/index");

// Synchronize the User model with the database
DeliveryPoint.sync({ force: false, alter: false })
  .then(() => {
    logger.info("DeliveryPoint table created (if not exists) successfully");
  })
  .catch((error) => {
    logger.error("Error creating DeliveryPoint table:", error);
    return new AppError("Error creating DeliveryPoint table", 500);
  });

// CRUD operations
exports.getAllDeliveryPoints = async (query) => {
  return await DeliveryPoint.scope("active").findAll(query);
};

exports.createDeliveryPoint = async (data) => {
  return await DeliveryPoint.create(data);
};

exports.getDeliveryPoint = async (id, attributes) => {
  return await DeliveryPoint.findByPk(id, { attributes });
};

exports.updateDeliveryPoint = async (id, data) => {
  return await DeliveryPoint.update(data, {
    where: { id },
    individualHooks: true,
  });
};

exports.deleteDeliveryPoint = async (id) => {
  return await DeliveryPoint.update(
    { deletedAt: Date.now() },
    {
      where: { id },
      individualHooks: true,
    }
  );
};

exports.bulkCreateDeliveryPoint = async (data) => {
  return await DeliveryPoint.bulkCreate(data);
};

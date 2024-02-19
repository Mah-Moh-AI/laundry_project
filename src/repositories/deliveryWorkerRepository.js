const DeliveryWorker = require("../models/deliveryWorkerModel");
const AppError = require("../utils/appError");
const logger = require("../logging/index");

// Synchronize the User model with the database
DeliveryWorker.sync({ force: false, alter: false })
  .then(() => {
    logger.info("DeliveryWorker table created (if not exists) successfully");
  })
  .catch((error) => {
    logger.error("Error creating DeliveryWorker table:", error);
    return new AppError("Error creating DeliveryWorker table", 500);
  });

// CRUD operations
exports.getAllDeliveryWorkers = async (query) => {
  return await DeliveryWorker.scope("active").findAll(query);
};

exports.createDeliveryWorker = async (data) => {
  return await DeliveryWorker.create(data);
};

exports.getDeliveryWorker = async (id, attributes) => {
  return await DeliveryWorker.findByPk(id, { attributes });
};

exports.updateDeliveryWorker = async (id, data) => {
  return await DeliveryWorker.update(data, {
    where: { id },
    individualHooks: true,
  });
};

exports.deleteDeliveryWorker = async (id) => {
  return await DeliveryWorker.update(
    { deletedAt: Date.now() },
    {
      where: { id },
      individualHooks: true,
    }
  );
};

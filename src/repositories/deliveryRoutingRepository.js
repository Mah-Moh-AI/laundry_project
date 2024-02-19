const DeliveryRouting = require("../models/deliveryRoutingModel");
const AppError = require("../utils/appError");
const logger = require("../logging/index");

// Synchronize the User model with the database
DeliveryRouting.sync({ force: false, alter: false })
  .then(() => {
    logger.info("DeliveryRouting table created (if not exists) successfully");
  })
  .catch((error) => {
    logger.error("Error creating DeliveryRouting table:", error);
    return new AppError("Error creating DeliveryRouting table", 500);
  });

// CRUD operations
exports.getAllDeliveryRoutings = async (query) => {
  return await DeliveryRouting.scope("active").findAll(query);
};

exports.createDeliveryRouting = async (data) => {
  return await DeliveryRouting.create(data);
};

exports.getDeliveryRouting = async (id, attributes) => {
  return await DeliveryRouting.findByPk(id, { attributes });
};

exports.updateDeliveryRouting = async (id, data) => {
  return await DeliveryRouting.update(data, {
    where: { id },
    individualHooks: true,
  });
};

exports.deleteDeliveryRouting = async (id) => {
  return await DeliveryRouting.update(
    { deletedAt: Date.now() },
    {
      where: { id },
      individualHooks: true,
    }
  );
};

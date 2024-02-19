const Order = require("../models/orderModel");
const AppError = require("../utils/appError");
const logger = require("../logging/index");

// Synchronize the User model with the database
Order.sync({ force: false, alter: false })
  .then(() => {
    logger.info("Order table created (if not exists) successfully");
  })
  .catch((error) => {
    logger.error("Error creating Order table:", error);
    return new AppError("Error creating Order table", 500);
  });

// CRUD operations
exports.getAllOrders = async (query) => {
  return await Order.scope("active").findAll(query);
  // return await Order.scope("active").findAll();
};

exports.createOrder = async (data) => {
  return await Order.create(data);
};

exports.getOrder = async (id, attributes) => {
  return await Order.findByPk(id, { attributes });
};

exports.updateOrder = async (id, data) => {
  return await Order.update(data, {
    where: { id },
    individualHooks: true,
  });
};

exports.deleteOrder = async (id) => {
  return await Order.update(
    { deletedAt: Date.now() },
    {
      where: { id },
      individualHooks: true,
    }
  );
};

exports.getordersLocations = async (orders) => {
  const ordersData = await Order.findAll({
    where: { id: orders },
  });

  const ordersLocations = ordersData.map((order) => ({
    orderId: order.dataValues.id,
    orderStatus: order.dataValues.status,
    locationId: order.dataValues.locationFk.id,
    locationPoint: order.dataValues.locationFk.locationPoint.coordinates,
  }));

  return ordersLocations;
};

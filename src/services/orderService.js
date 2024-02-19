const AppError = require("../utils/appError");
const orderRepository = require("../repositories/orderRepository");
const APIFeatures = require("../utils/apiFeatures");

class OrderService {
  async getAllOrders(queryString) {
    const features = new APIFeatures(queryString).features();
    return await orderRepository.getAllOrders(features.query);
  }

  async createOrder(data) {
    const allowedFields = [
      "locationId",
      "orderTime",
      "deliveryTypeId",
      "deliveryDate",
      "operatorId",
      "itemsQuantity",
      "status",
    ];
    Object.keys(data).forEach((key) => {
      if (!allowedFields.includes(key)) {
        throw new AppError(
          `You do not have permission to create field ${key}`,
          403
        );
      }
    });
    return await orderRepository.createOrder(data);
  }

  async getOrder(id) {
    return await orderRepository.getOrder(id);
  }

  async updateOrder(id, data) {
    const order = await orderRepository.getOrder(id);
    if (!order) {
      throw new AppError("This id don't exist", 400);
    }
    const allowedFields = [
      "locationId",
      "orderTime",
      "deliveryTypeId",
      "deliveryDate",
      "operatorId",
      "itemsQuantity",
      "status",
    ];
    Object.keys(data).forEach((key) => {
      if (!allowedFields.includes(key)) {
        throw new AppError(
          `You do not have permission to update field ${key}`,
          403
        );
      }
    });
    const [updateStatus] = await orderRepository.updateOrder(id, data);
    if (updateStatus === 0) {
      return "order is not updated";
    }
    return "order is updated";
  }

  async deleteOrder(id) {
    const order = await orderRepository.getOrder(id);
    if (!order) {
      throw new AppError("This id don't exist", 400);
    }
    const [deleteStatus] = await orderRepository.deleteOrder(id);
    if (deleteStatus === 0) {
      throw new AppError("Order is not soft deleted", 500);
    }
    return "Order is soft deleted";
  }
}

module.exports = new OrderService();

const AppError = require("../utils/appError");
const deliveryPointRepository = require("../repositories/deliveryPointRepository");
const APIFeatures = require("../utils/apiFeatures");

class DeliveryPointService {
  async getAllDeliveryPoints(queryString) {
    const features = new APIFeatures(queryString).features();
    return await deliveryPointRepository.getAllDeliveryPoints(features.query);
  }

  async createDeliveryPoint(data) {
    const allowedFields = ["deliveryRouteId", "orderId", "sequenceNumber"];
    Object.keys(data).forEach((key) => {
      if (!allowedFields.includes(key)) {
        throw new AppError(
          `You do not have permission to create field ${key}`,
          403
        );
      }
    });
    return await deliveryPointRepository.createDeliveryPoint(data);
  }

  async getDeliveryPoint(id) {
    return await deliveryPointRepository.getDeliveryPoint(id);
  }

  async updateDeliveryPoint(id, data) {
    const deliveryPoint = await deliveryPointRepository.getDeliveryPoint(id);
    if (!deliveryPoint) {
      throw new AppError("This id don't exist", 400);
    }
    const allowedFields = ["deliveryRouteId", "orderId", "sequenceNumber"];
    Object.keys(data).forEach((key) => {
      if (!allowedFields.includes(key)) {
        throw new AppError(
          `You do not have permission to update field ${key}`,
          403
        );
      }
    });
    const [updateStatus] = await deliveryPointRepository.updateDeliveryPoint(
      id,
      data
    );
    if (updateStatus === 0) {
      return "deliveryPoint is not updated";
    }
    return "deliveryPoint is updated";
  }

  async deleteDeliveryPoint(id) {
    const deliveryPoint = await deliveryPointRepository.getDeliveryPoint(id);
    if (!deliveryPoint) {
      throw new AppError("This id don't exist", 400);
    }
    const [deleteStatus] = await deliveryPointRepository.deleteDeliveryPoint(
      id
    );
    if (deleteStatus === 0) {
      throw new AppError("DeliveryPoint is not soft deleted", 500);
    }
    return "DeliveryPoint is soft deleted";
  }
}

module.exports = new DeliveryPointService();

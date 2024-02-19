const AppError = require("../utils/appError");
const deliveryTypeRepository = require("../repositories/deliveryTypeRepository");
const APIFeatures = require("../utils/apiFeatures");

class DeliveryTypeService {
  async getAllDeliveryTypes(queryString) {
    const features = new APIFeatures(queryString).features();
    return await deliveryTypeRepository.getAllDeliveryTypes(features.query);
  }

  async createDeliveryType(data) {
    const allowedFields = ["type"];
    Object.keys(data).forEach((key) => {
      if (!allowedFields.includes(key)) {
        throw new AppError(
          `You do not have permission to create field ${key}`,
          403
        );
      }
    });
    return await deliveryTypeRepository.createDeliveryType(data);
  }

  async getDeliveryType(id) {
    return await deliveryTypeRepository.getDeliveryType(id);
  }

  async updateDeliveryType(id, data) {
    const deliveryType = await deliveryTypeRepository.getDeliveryType(id);
    if (!deliveryType) {
      throw new AppError("This id don't exist", 400);
    }
    const allowedFields = ["type"];
    Object.keys(data).forEach((key) => {
      if (!allowedFields.includes(key)) {
        throw new AppError(
          `You do not have permission to update field ${key}`,
          403
        );
      }
    });
    const [updateStatus] = await deliveryTypeRepository.updateDeliveryType(
      id,
      data
    );
    if (updateStatus === 0) {
      return "deliveryType is not updated";
    }
    return "deliveryType is updated";
  }

  async deleteDeliveryType(id) {
    const deliveryType = await deliveryTypeRepository.getDeliveryType(id);
    if (!deliveryType) {
      throw new AppError("This id don't exist", 400);
    }
    const [deleteStatus] = await deliveryTypeRepository.deleteDeliveryType(id);
    if (deleteStatus === 0) {
      throw new AppError("DeliveryType is not soft deleted", 500);
    }
    return "DeliveryType is soft deleted";
  }
}

module.exports = new DeliveryTypeService();

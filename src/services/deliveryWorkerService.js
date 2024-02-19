const AppError = require("../utils/appError");
const deliveryWorkerRepository = require("../repositories/deliveryWorkerRepository");
const APIFeatures = require("../utils/apiFeatures");

class DeliveryWorkerService {
  async getAllDeliveryWorkers(queryString) {
    const features = new APIFeatures(queryString).features();
    return await deliveryWorkerRepository.getAllDeliveryWorkers(features.query);
  }

  async createDeliveryWorker(data) {
    const allowedFields = ["name", "mobileNumber", "currentLocation"];
    Object.keys(data).forEach((key) => {
      if (!allowedFields.includes(key)) {
        throw new AppError(
          `You do not have permission to create field ${key}`,
          403
        );
      }
    });
    return await deliveryWorkerRepository.createDeliveryWorker(data);
  }

  async getDeliveryWorker(id) {
    return await deliveryWorkerRepository.getDeliveryWorker(id);
  }

  async updateDeliveryWorker(id, data) {
    const deliveryWorker = await deliveryWorkerRepository.getDeliveryWorker(id);
    if (!deliveryWorker) {
      throw new AppError("This id don't exist", 400);
    }
    const allowedFields = ["name", "mobileNumber", "currentLocation"];
    Object.keys(data).forEach((key) => {
      if (!allowedFields.includes(key)) {
        throw new AppError(
          `You do not have permission to update field ${key}`,
          403
        );
      }
    });
    const [updateStatus] = await deliveryWorkerRepository.updateDeliveryWorker(
      id,
      data
    );
    if (updateStatus === 0) {
      return "deliveryWorker is not updated";
    }
    return "deliveryWorker is updated";
  }

  async deleteDeliveryWorker(id) {
    const deliveryWorker = await deliveryWorkerRepository.getDeliveryWorker(id);
    if (!deliveryWorker) {
      throw new AppError("This id don't exist", 400);
    }
    const [deleteStatus] = await deliveryWorkerRepository.deleteDeliveryWorker(
      id
    );
    if (deleteStatus === 0) {
      throw new AppError("DeliveryWorker is not soft deleted", 500);
    }
    return "DeliveryWorker is soft deleted";
  }
}

module.exports = new DeliveryWorkerService();

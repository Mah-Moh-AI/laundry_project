const AppError = require("../utils/appError");
const serviceRepository = require("../repositories/serviceRepository");
const APIFeatures = require("../utils/apiFeatures");

class ServiceService {
  async getAllServices(queryString) {
    const features = new APIFeatures(queryString).features();

    return await serviceRepository.getAllServices(features.query);
  }

  async createService(data) {
    const allowedFields = [
      "clothesTypeId",
      "servicePreferenceId",
      "serviceOptionId",
      "deliveryTypeId",
      "servicePrice",
    ];
    Object.keys(data).forEach((key) => {
      if (!allowedFields.includes(key)) {
        throw new AppError(
          `You do not have permission to create field ${key}`,
          403
        );
      }
    });
    return await serviceRepository.createService(data);
  }

  async getService(id) {
    return await serviceRepository.getService(id);
  }

  async updateService(id, data) {
    const service = await serviceRepository.getService(id);
    if (!service) {
      throw new AppError("This id don't exist", 400);
    }
    const allowedFields = [
      "clothesTypeId",
      "servicePreferenceId",
      "serviceOptionId",
      "deliveryTypeId",
      "servicePrice",
    ];
    Object.keys(data).forEach((key) => {
      if (!allowedFields.includes(key)) {
        throw new AppError(
          `You do not have permission to update field ${key}`,
          403
        );
      }
    });
    const [updateStatus] = await serviceRepository.updateService(id, data);
    if (updateStatus === 0) {
      return "service is not updated";
    }
    return "service is updated";
  }

  async deleteService(id) {
    const service = await serviceRepository.getService(id);
    if (!service) {
      throw new AppError("This id don't exist", 400);
    }
    const [deleteStatus] = await serviceRepository.deleteService(id);
    if (deleteStatus === 0) {
      throw new AppError("Service is not soft deleted", 500);
    }
    return "Service is soft deleted";
  }
}

module.exports = new ServiceService();

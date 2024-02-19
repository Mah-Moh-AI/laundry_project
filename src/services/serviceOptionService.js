const AppError = require("../utils/appError");
const serviceOptionRepository = require("../repositories/serviceOptionRepository");
const APIFeatures = require("../utils/apiFeatures");

class ServiceOptionService {
  async getAllServiceOptions(queryString) {
    const features = new APIFeatures(queryString).features();
    return await serviceOptionRepository.getAllServiceOptions(features.query);
  }

  async createServiceOption(data) {
    const allowedFields = ["option"];
    Object.keys(data).forEach((key) => {
      if (!allowedFields.includes(key)) {
        throw new AppError(
          `You do not have permission to create field ${key}`,
          403
        );
      }
    });
    return await serviceOptionRepository.createServiceOption(data);
  }

  async getServiceOption(id) {
    return await serviceOptionRepository.getServiceOption(id);
  }

  async updateServiceOption(id, data) {
    const serviceOption = await serviceOptionRepository.getServiceOption(id);
    if (!serviceOption) {
      throw new AppError("This id don't exist", 400);
    }
    const allowedFields = ["option"];
    Object.keys(data).forEach((key) => {
      if (!allowedFields.includes(key)) {
        throw new AppError(
          `You do not have permission to update field ${key}`,
          403
        );
      }
    });
    const [updateStatus] = await serviceOptionRepository.updateServiceOption(
      id,
      data
    );
    if (updateStatus === 0) {
      return "serviceOption is not updated";
    }
    return "serviceOption is updated";
  }

  async deleteServiceOption(id) {
    const serviceOption = await serviceOptionRepository.getServiceOption(id);
    if (!serviceOption) {
      throw new AppError("This id don't exist", 400);
    }
    const [deleteStatus] = await serviceOptionRepository.deleteServiceOption(
      id
    );
    if (deleteStatus === 0) {
      throw new AppError("ServiceOption is not soft deleted", 500);
    }
    return "ServiceOption is soft deleted";
  }
}

module.exports = new ServiceOptionService();

const AppError = require("../utils/appError");
const servicePreferenceRepository = require("../repositories/servicePreferenceRepository");
const APIFeatures = require("../utils/apiFeatures");

class ServicePreferenceService {
  async getAllServicePreferences(queryString) {
    const features = new APIFeatures(queryString).features();
    return await servicePreferenceRepository.getAllServicePreferences(
      features.query
    );
  }

  async createServicePreference(data) {
    const allowedFields = ["preference"];
    Object.keys(data).forEach((key) => {
      if (!allowedFields.includes(key)) {
        throw new AppError(
          `You do not have permission to create field ${key}`,
          403
        );
      }
    });
    return await servicePreferenceRepository.createServicePreference(data);
  }

  async getServicePreference(id) {
    return await servicePreferenceRepository.getServicePreference(id);
  }

  async updateServicePreference(id, data) {
    const servicePreference =
      await servicePreferenceRepository.getServicePreference(id);
    if (!servicePreference) {
      throw new AppError("This id don't exist", 400);
    }
    const allowedFields = ["preference"];
    Object.keys(data).forEach((key) => {
      if (!allowedFields.includes(key)) {
        throw new AppError(
          `You do not have permission to update field ${key}`,
          403
        );
      }
    });
    const [updateStatus] =
      await servicePreferenceRepository.updateServicePreference(id, data);
    if (updateStatus === 0) {
      return "servicePreference is not updated";
    }
    return "servicePreference is updated";
  }

  async deleteServicePreference(id) {
    const servicePreference =
      await servicePreferenceRepository.getServicePreference(id);
    if (!servicePreference) {
      throw new AppError("This id don't exist", 400);
    }
    const [deleteStatus] =
      await servicePreferenceRepository.deleteServicePreference(id);
    if (deleteStatus === 0) {
      throw new AppError("ServicePreference is not soft deleted", 500);
    }
    return "ServicePreference is soft deleted";
  }
}

module.exports = new ServicePreferenceService();

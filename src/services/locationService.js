const AppError = require("../utils/appError");
const locationRepository = require("../repositories/locationRepository");
const APIFeatures = require("../utils/apiFeatures");

class LocationService {
  async getAllLocations(queryString) {
    const features = new APIFeatures(queryString).features();
    return await locationRepository.getAllLocations(features.query);
  }

  async createLocation(data) {
    const allowedFields = [
      "clientId",
      "locationPoint",
      "postalCode",
      "street",
      "district",
      "city",
      "state",
    ];
    Object.keys(data).forEach((key) => {
      if (!allowedFields.includes(key)) {
        throw new AppError(
          `You do not have permission to create field ${key}`,
          403
        );
      }
    });

    data.locationPoint = { type: "Point", coordinates: data.locationPoint };

    return await locationRepository.createLocation(data);
  }

  async getLocation(id) {
    return await locationRepository.getLocation(id);
  }

  async updateLocation(id, data) {
    const location = await locationRepository.getLocation(id);
    if (!location) {
      throw new AppError("This id don't exist", 400);
    }
    const allowedFields = [
      "clientId",
      "locationPoint",
      "postalCode",
      "street",
      "district",
      "city",
      "state",
    ];
    Object.keys(data).forEach((key) => {
      if (!allowedFields.includes(key)) {
        throw new AppError(
          `You do not have permission to update field ${key}`,
          403
        );
      }
    });

    if (data.locationPoint) {
      data.locationPoint = { type: "Point", coordinates: data.locationPoint };
    }

    const [updateStatus] = await locationRepository.updateLocation(id, data);
    if (updateStatus === 0) {
      return "location is not updated";
    }
    return "location is updated";
  }

  async deleteLocation(id) {
    const location = await locationRepository.getLocation(id);
    if (!location) {
      throw new AppError("This id don't exist", 400);
    }
    const [deleteStatus] = await locationRepository.deleteLocation(id);
    if (deleteStatus === 0) {
      throw new AppError("Location is not soft deleted", 500);
    }
    return "Location is soft deleted";
  }
}

module.exports = new LocationService();

const AppError = require("../utils/appError");
const clothesTypeRepository = require("../repositories/clothesTypeRepository");
const APIFeatures = require("../utils/apiFeatures");

class ClothesTypeService {
  async getAllClothesTypes(queryString) {
    const features = new APIFeatures(queryString).features();
    return await clothesTypeRepository.getAllClothesTypes(features.query);
  }

  async createClothesType(data) {
    const allowedFields = ["type"];
    Object.keys(data).forEach((key) => {
      if (!allowedFields.includes(key)) {
        throw new AppError(
          `You do not have permission to create field ${key}`,
          403
        );
      }
    });
    return await clothesTypeRepository.createClothesType(data);
  }

  async getClothesType(id) {
    return await clothesTypeRepository.getClothesType(id);
  }

  async updateClothesType(id, data) {
    const clothesType = await clothesTypeRepository.getClothesType(id);
    if (!clothesType) {
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
    const [updateStatus] = await clothesTypeRepository.updateClothesType(
      id,
      data
    );
    if (updateStatus === 0) {
      return "clothesType is not updated";
    }
    return "clothesType is updated";
  }

  async deleteClothesType(id) {
    const clothesType = await clothesTypeRepository.getClothesType(id);
    if (!clothesType) {
      throw new AppError("This id don't exist", 400);
    }
    const [deleteStatus] = await clothesTypeRepository.deleteClothesType(id);
    if (deleteStatus === 0) {
      throw new AppError("ClothesType is not soft deleted", 500);
    }
    return "ClothesType is soft deleted";
  }
}

module.exports = new ClothesTypeService();

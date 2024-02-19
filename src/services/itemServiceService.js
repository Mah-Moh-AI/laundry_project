const AppError = require("../utils/appError");
const itemServiceRepository = require("../repositories/itemServiceRepository");
const APIFeatures = require("../utils/apiFeatures");

class ItemServiceService {
  async getAllItemServices(queryString) {
    const features = new APIFeatures(queryString).features();
    return await itemServiceRepository.getAllItemServices(features.query);
  }

  async createItemService(data) {
    const allowedFields = ["orderId", "serviceId", "quantity", "status"];
    Object.keys(data).forEach((key) => {
      if (!allowedFields.includes(key)) {
        throw new AppError(
          `You do not have permission to create field ${key}`,
          403
        );
      }
    });
    return await itemServiceRepository.createItemService(data);
  }

  async getItemService(id) {
    return await itemServiceRepository.getItemService(id);
  }

  async updateItemService(id, data) {
    const itemService = await itemServiceRepository.getItemService(id);
    if (!itemService) {
      throw new AppError("This id don't exist", 400);
    }
    const allowedFields = ["orderId", "serviceId", "quantity", "status"];
    Object.keys(data).forEach((key) => {
      if (!allowedFields.includes(key)) {
        throw new AppError(
          `You do not have permission to update field ${key}`,
          403
        );
      }
    });
    const [updateStatus] = await itemServiceRepository.updateItemService(
      id,
      data
    );
    if (updateStatus === 0) {
      return "itemService is not updated";
    }
    return "itemService is updated";
  }

  async deleteItemService(id) {
    const itemService = await itemServiceRepository.getItemService(id);
    if (!itemService) {
      throw new AppError("This id don't exist", 400);
    }
    const [deleteStatus] = await itemServiceRepository.deleteItemService(id);
    if (deleteStatus === 0) {
      throw new AppError("ItemService is not soft deleted", 500);
    }
    return "ItemService is soft deleted";
  }
}

module.exports = new ItemServiceService();

const AppError = require("../utils/appError");
const clientRepository = require("../repositories/clientRepository");
const APIFeatures = require("../utils/apiFeatures");

class ClientService {
  async getAllClients(queryString) {
    const features = new APIFeatures(queryString).features();
    return await clientRepository.getAllClients(features.query);
  }

  async createClient(data) {
    const allowedFields = ["userId", "lastLocation"];
    Object.keys(data).forEach((key) => {
      if (!allowedFields.includes(key)) {
        throw new AppError(
          `You do not have permission to create field ${key}`,
          403
        );
      }
    });
    return await clientRepository.createClient(data);
  }

  async getClient(id) {
    return await clientRepository.getClient(id);
  }

  async updateClient(id, data) {
    const client = await clientRepository.getClient(id);
    if (!client) {
      throw new AppError("This id don't exist", 400);
    }
    const allowedFields = ["userId", "lastLocation"];
    Object.keys(data).forEach((key) => {
      if (!allowedFields.includes(key)) {
        throw new AppError(
          `You do not have permission to update field ${key}`,
          403
        );
      }
    });
    const [updateStatus] = await clientRepository.updateClient(id, data);
    if (updateStatus === 0) {
      return "client is not updated";
    }
    return "client is updated";
  }

  async deleteClient(id) {
    const client = await clientRepository.getClient(id);
    if (!client) {
      throw new AppError("This id don't exist", 400);
    }
    [deleteStatus] = await clientRepository.deleteClient(id);
    if (deleteStatus === 0) {
      throw new AppError("Client is not soft deleted", 500);
    }
    return "Client is soft deleted";
  }
}

module.exports = new ClientService();

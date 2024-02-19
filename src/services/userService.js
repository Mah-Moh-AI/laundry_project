const AppError = require("../utils/appError");
const logger = require("../logging/index");
const catchAsync = require("../utils/catchAsync");
const APIFeatures = require("../utils/apiFeatures");
const userRepository = require("../repositories/userRepository");

class UserService {
  async getAllUsers(queryString) {
    const features = new APIFeatures(queryString).features();
    const users = await userRepository.getAllUsers(features.query);
    return users;
  }

  async createUser(userData) {
    const allowedFields = [
      "name",
      "role",
      "branch",
      "email",
      "password",
      "mobileNumber",
    ];
    Object.keys(userData).forEach((key) => {
      if (!allowedFields.includes(key)) {
        throw new AppError(
          `You do not have permission to create field ${key}`,
          403
        );
      }
    });
    return await userRepository.createUser(userData);
  }

  async getUser(id) {
    return await userRepository.getUser(id);
  }

  async updateUser(id, data) {
    const user = await userRepository.getUser(id);
    if (!user) {
      throw new AppError("This id don't exist", 400);
    }
    const allowedFields = ["name", "role", "branch"];
    Object.keys(data).forEach((key) => {
      if (!allowedFields.includes(key)) {
        throw new AppError(
          `You do not have permission to update field ${key}`,
          403
        );
      }
    });
    const [userUpdateStatus] = await userRepository.updateUser(id, data);
    if (userUpdateStatus === 0) {
      return "User is not updated";
    }
    return "User is updated";
  }

  async deleteUser(id) {
    const user = await userRepository.getUser(id);
    if (!user) {
      throw new AppError("This id don't exist", 400);
    }
    const [deleteStatus] = await userRepository.deleteUser(id);
    if (deleteStatus === 0) {
      throw new AppError("User is not soft deleted", 500);
    }
    return "User is soft deleted";
  }
}

module.exports = new UserService();

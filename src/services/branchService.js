const AppError = require("../utils/appError");
const branchRepository = require("../repositories/branchRepository");
const APIFeatures = require("../utils/apiFeatures");

class BranchService {
  async getAllBranches(queryString) {
    const features = new APIFeatures(queryString).features();
    return await branchRepository.getAllBranches(features.query);
  }

  async createBranch(data) {
    const allowedFields = [
      "name",
      "location",
      "buildingNumber",
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

    data.location = { type: "Point", coordinates: data.location };

    return await branchRepository.createBranch(data);
  }

  async getBranch(id) {
    return await branchRepository.getBranch(id);
  }

  async updateBranch(id, data) {
    const branch = await branchRepository.getBranch(id);
    if (!branch) {
      throw new AppError("This id don't exist", 400);
    }
    const allowedFields = [
      "name",
      "location",
      "buildingNumber",
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

    if (data.location) {
      data.location = { type: "Point", coordinates: data.location };
    }

    const [branchUpdateStatus] = await branchRepository.updateBranch(id, data);
    if (branchUpdateStatus === 0) {
      return "branch is not updated";
    }
    return "branch is updated";
  }

  async deleteBranch(id) {
    const branch = await branchRepository.getBranch(id);
    if (!branch) {
      throw new AppError("This id don't exist", 400);
    }
    const [deleteStatus] = await branchRepository.deleteBranch(id);
    if (deleteStatus === 0) {
      throw new AppError("Branch is not soft deleted", 500);
    }
    return "Branch is soft deleted";
  }
}

module.exports = new BranchService();

const Branch = require("../models/branchModel");
const AppError = require("../utils/appError");
const logger = require("../logging/index");

// Synchronize the User model with the database
(async () => {
  Branch.sync({ force: false, alter: false })
    .then(() => {
      logger.info("Branch table created (if not exists) successfully");
    })
    .catch((error) => {
      logger.error("Error creating Branch table:", error);
      return new AppError("Error creating Branch table", 500);
    });
})();

// CRUD operations
exports.getAllBranches = async (query) => {
  return await Branch.scope("active").findAll(query);
};

exports.createBranch = async (data) => {
  return await Branch.create(data);
};

exports.getBranch = async (id, attributes) => {
  return await Branch.findByPk(id, { attributes });
};

exports.updateBranch = async (id, branchData) => {
  return await Branch.update(branchData, {
    where: { id },
  });
};

exports.deleteBranch = async (id) => {
  return await Branch.update(
    { deletedAt: Date.now() },
    {
      where: { id },
    }
  );
};

exports.getBranchLocation = async (branch) => {
  const branchData = await Branch.findByPk(branch, {
    attributes: ["id", "location"],
  });
  const branchLocation = {
    branchId: branchData.dataValues.id,
    locationPoint: branchData.dataValues.location.coordinates,
  };
  return branchLocation;
};

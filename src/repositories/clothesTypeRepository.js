const ClothesType = require("../models/clothesTypeModel");
const AppError = require("../utils/appError");
const logger = require("../logging/index");

// Synchronize the User model with the database
ClothesType.sync({ force: false, alter: false })
  .then(() => {
    logger.info("ClothesType table created (if not exists) successfully");
  })
  .catch((error) => {
    logger.error("Error creating ClothesType table:", error);
    return new AppError("Error creating ClothesType table", 500);
  });

// CRUD operations
exports.getAllClothesTypes = async (query) => {
  return await ClothesType.scope("active").findAll(query);
};

exports.createClothesType = async (data) => {
  return await ClothesType.create(data);
};

exports.getClothesType = async (id, attributes) => {
  return await ClothesType.findByPk(id, { attributes });
};

exports.updateClothesType = async (id, data) => {
  return await ClothesType.update(data, {
    where: { id },
    individualHooks: true,
  });
};

exports.deleteClothesType = async (id) => {
  return await ClothesType.update(
    { deletedAt: Date.now() },
    {
      where: { id },
      individualHooks: true,
    }
  );
};

const ItemService = require("../models/itemServiceModel");
const AppError = require("../utils/appError");
const logger = require("../logging/index");

// Synchronize the User model with the database
ItemService.sync({ force: false, alter: false })
  .then(() => {
    logger.info("ItemService table created (if not exists) successfully");
  })
  .catch((error) => {
    logger.error("Error creating ItemService table:", error);
    return new AppError("Error creating ItemService table", 500);
  });

// CRUD operations
exports.getAllItemServices = async (query) => {
  return await ItemService.scope("active").findAll(query);
};

exports.createItemService = async (data) => {
  return await ItemService.create(data);
};

exports.getItemService = async (id, attributes) => {
  return await ItemService.findByPk(id, { attributes });
};

exports.updateItemService = async (id, data) => {
  return await ItemService.update(data, {
    where: { id },
    individualHooks: true,
  });
};

exports.deleteItemService = async (id) => {
  return await ItemService.update(
    { deletedAt: Date.now() },
    {
      where: { id },
      individualHooks: true,
    }
  );
};

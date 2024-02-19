const Client = require("../models/clientModel");
const AppError = require("../utils/appError");
const logger = require("../logging/index");

// Synchronize the User model with the database
(async () => {
  Client.sync({ force: false, alter: false })
    .then(() => {
      logger.info("Client table created (if not exists) successfully");
    })
    .catch((error) => {
      logger.error("Error creating Client table:", error);
      return new AppError("Error creating Client table", 500);
    });
})();

// CRUD operations
exports.getAllClients = async (query) => {
  return await Client.scope("active").findAll(query);
};

exports.createClient = async (data) => {
  return await Client.create(data);
};

exports.getClient = async (id, attributes) => {
  return await Client.scope("active").findByPk(id, { attributes });
};

exports.updateClient = async (id, data) => {
  return await Client.update(data, {
    where: { id },
    individualHooks: true,
  });
};

exports.deleteClient = async (id) => {
  return await Client.update(
    { deletedAt: Date.now() },
    {
      where: { id },
      individualHooks: true,
    }
  );
};

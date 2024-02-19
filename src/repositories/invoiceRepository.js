const Invoice = require("../models/invoiceModel");
const AppError = require("../utils/appError");
const logger = require("../logging/index");

// Synchronize the User model with the database
Invoice.sync({ force: false, alter: false })
  .then(() => {
    logger.info("Invoice table created (if not exists) successfully");
  })
  .catch((error) => {
    logger.error("Error creating Invoice table:", error);
    return new AppError("Error creating Invoice table", 500);
  });

// CRUD operations
exports.getAllInvoices = async (query) => {
  return await Invoice.scope("active").findAll(query);
};

exports.createInvoice = async (data) => {
  return await Invoice.create(data);
};

exports.getInvoice = async (id, attributes) => {
  return await Invoice.findByPk(id, { attributes });
};

exports.updateInvoice = async (id, data) => {
  return await Invoice.update(data, {
    where: { id },
    individualHooks: true,
  });
};

exports.deleteInvoice = async (id) => {
  return await Invoice.update(
    { deletedAt: Date.now() },
    {
      where: { id },
      individualHooks: true,
    }
  );
};

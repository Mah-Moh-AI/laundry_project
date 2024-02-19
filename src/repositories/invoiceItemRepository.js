const InvoiceItem = require("../models/invoiceItemModel");
const AppError = require("../utils/appError");
const logger = require("../logging/index");

// Synchronize the User model with the database
InvoiceItem.sync({ force: false, alter: false })
  .then(() => {
    logger.info("InvoiceItem table created (if not exists) successfully");
  })
  .catch((error) => {
    logger.error("Error creating InvoiceItem table:", error);
    return new AppError("Error creating InvoiceItem table", 500);
  });

// CRUD operations
exports.getAllInvoiceItems = async (query) => {
  return await InvoiceItem.scope("active").findAll(query);
};

exports.createInvoiceItem = async (data) => {
  return await InvoiceItem.create(data);
};

exports.getInvoiceItem = async (id, attributes) => {
  return await InvoiceItem.findByPk(id, { attributes });
};

exports.updateInvoiceItem = async (id, data) => {
  return await InvoiceItem.update(data, {
    where: { id },
    individualHooks: true,
  });
};

exports.deleteInvoiceItem = async (id) => {
  return await InvoiceItem.update(
    { deletedAt: Date.now() },
    {
      where: { id },
      individualHooks: true,
    }
  );
};

exports.bulkCreateInvoiceItem = async (data) => {
  return await InvoiceItem.bulkCreate(data);
};

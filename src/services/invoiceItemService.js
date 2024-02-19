const AppError = require("../utils/appError");
const invoiceItemRepository = require("../repositories/invoiceItemRepository");
const APIFeatures = require("../utils/apiFeatures");

class InvoiceItemService {
  async getAllInvoiceItems(queryString) {
    const features = new APIFeatures(queryString).features();
    return await invoiceItemRepository.getAllInvoiceItems(features.query);
  }

  async createInvoiceItem(data) {
    const allowedFields = [
      "invoiceId",
      "serviceId",
      "itemQuantity",
      "itemPrice",
      "itemTotalPrice",
      "orderId",
    ];
    Object.keys(data).forEach((key) => {
      if (!allowedFields.includes(key)) {
        throw new AppError(
          `You do not have permission to create field ${key}`,
          403
        );
      }
    });
    return await invoiceItemRepository.createInvoiceItem(data);
  }

  async getInvoiceItem(id) {
    return await invoiceItemRepository.getInvoiceItem(id);
  }

  async updateInvoiceItem(id, data) {
    const invoiceItem = await invoiceItemRepository.getInvoiceItem(id);
    if (!invoiceItem) {
      throw new AppError("This id don't exist", 400);
    }
    const allowedFields = [
      "invoiceId",
      "serviceId",
      "itemQuantity",
      "itemPrice",
      "itemTotalPrice",
      "orderId",
    ];
    Object.keys(data).forEach((key) => {
      if (!allowedFields.includes(key)) {
        throw new AppError(
          `You do not have permission to update field ${key}`,
          403
        );
      }
    });
    const [updateStatus] = await invoiceItemRepository.updateInvoiceItem(
      id,
      data
    );
    if (updateStatus === 0) {
      return "invoiceItem is not updated";
    }
    return "invoiceItem is updated";
  }

  async deleteInvoiceItem(id) {
    const invoiceItem = await invoiceItemRepository.getInvoiceItem(id);
    if (!invoiceItem) {
      throw new AppError("This id don't exist", 400);
    }
    const [deleteStatus] = await invoiceItemRepository.deleteInvoiceItem(id);
    if (deleteStatus === 0) {
      throw new AppError("InvoiceItem is not soft deleted", 500);
    }
    return "InvoiceItem is soft deleted";
  }
}

module.exports = new InvoiceItemService();

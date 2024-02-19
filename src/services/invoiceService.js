const AppError = require("../utils/appError");
const { fs, path } = require("../utils/npmPackages");
const invoiceRepository = require("../repositories/invoiceRepository");
const invoiceItemRepository = require("../repositories/invoiceItemRepository");
const itemServiceRepository = require("../repositories/itemServiceRepository");
const APIFeatures = require("../utils/apiFeatures");
const CreateInvoicePDF = require("../utils/createInvoicePdf");

class InvoiceService {
  async getAllInvoices(queryString) {
    const features = new APIFeatures(queryString).features();
    return await invoiceRepository.getAllInvoices(features.query);
  }

  async createInvoice(data) {
    const allowedFields = [
      "invoiceNumber", // to be checked if should be auto-generated
      "date",
      "clientId",
      "orderId",
      "InvoiceTotalPrice", // should be auto generated
    ];
    Object.keys(data).forEach((key) => {
      if (!allowedFields.includes(key)) {
        throw new AppError(
          `You do not have permission to create field ${key}`,
          403
        );
      }
    });

    const invoice = await invoiceRepository.createInvoice(data);

    // get itemService by orderId
    const itemService = await itemServiceRepository.getAllItemServices({
      orderId: data.orderId,
    });
    // create empty array and object
    const compiledServiceItems = [];
    const serviceNamesObject = {};

    // for loop through itemService to push any new item service or update quantity
    for (const item of itemService) {
      if (
        !compiledServiceItems.find(
          (serviceItem) => serviceItem.serviceId === item.serviceId
        )
      ) {
        const serviceItemData = {
          invoiceId: invoice.id,
          serviceId: item.serviceId,
          orderId: item.orderId,
          itemQuantity: item.quantity,
          itemPrice: item.serviceFk.servicePrice,
          itemTotalPrice: item.serviceFk.servicePrice * item.quantity,
        };

        compiledServiceItems.push(serviceItemData);
        serviceNamesObject[
          item.serviceId
        ] = `${item.serviceFk.clothesTypeFk.type} ${item.serviceFk.serviceOptionFk.option} ${item.serviceFk.servicePreferenceFk.preference} ${item.serviceFk.serviceOptionFk.option} ${item.serviceFk.deliveryTypeServiceFk.type}`;
      }
      const existingItem = compiledServiceItems.find(
        (serviceItem) => serviceItem.serviceId === item.serviceId
      );
      existingItem.itemQuantity += item.quantity;
      existingItem.itemTotalPrice +=
        item.serviceFk.servicePrice * item.quantity; // Adjust the total price
    }

    // batch create invoiceItems based on created object
    const createdInvoiceItems =
      await invoiceItemRepository.bulkCreateInvoiceItem(compiledServiceItems);

    // invoiceItems = [{id, serviceName, itemQuantity, itemPrice, itemTotalPrice}, {}, {}]
    const invoiceItems = [];
    for (const item of createdInvoiceItems) {
      const invoiceItem = {
        id: item.id,
        serviceName: serviceNamesObject[item.serviceId],
        itemQuantity: item.itemQuantity,
        itemPrice: item.itemPrice,
        itemTotalPrice: item.itemTotalPrice,
      };
      invoiceItems.push(invoiceItem);
    }

    const invoicePDFPath = CreateInvoicePDF(invoice, invoiceItems); // check error handeling

    return { invoice, invoicePDFPath };
  }

  async getInvoice(id) {
    return await invoiceRepository.getInvoice(id);
  }

  async downloadInvoicePDF(id) {
    const publicFolderPath = path.resolve("./public/data/invoices");

    const pdfLink = path.join(publicFolderPath, `invoice-${id}.pdf`);
    try {
      if (fs.existsSync(pdfLink)) {
        const fileStream = fs.createReadStream(
          "D:\\0- CS Study\\2- backend\\3_Laundry_Project\\public\\data\\invoices\\invoice-4e7c50df-d7d3-481f-9fe7-aee8723afaae.pdf"
        );
        return fileStream;
      }
    } catch (err) {
      throw err;
    }
  }

  async updateInvoice(id, data) {
    const invoice = await invoiceRepository.getInvoice(id);
    if (!invoice) {
      throw new AppError("This id don't exist", 400);
    }
    const allowedFields = [
      "invoiceNumber",
      "date",
      "clientId",
      "orderId",
      "InvoiceTotalPrice",
    ];
    Object.keys(data).forEach((key) => {
      if (!allowedFields.includes(key)) {
        throw new AppError(
          `You do not have permission to update field ${key}`,
          403
        );
      }
    });
    const [updateStatus] = await invoiceRepository.updateInvoice(id, data);
    if (updateStatus === 0) {
      return "invoice is not updated";
    }
    return "invoice is updated";
  }

  async deleteInvoice(id) {
    const invoice = await invoiceRepository.getInvoice(id);
    if (!invoice) {
      throw new AppError("This id don't exist", 400);
    }
    const [deleteStatus] = await invoiceRepository.deleteInvoice(id);
    if (deleteStatus === 0) {
      throw new AppError("Invoice is not soft deleted", 500);
    }
    return "Invoice is soft deleted";
  }
}

module.exports = new InvoiceService();

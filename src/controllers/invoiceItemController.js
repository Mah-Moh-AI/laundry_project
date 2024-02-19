// import files
const invoiceItemService = require("../services/invoiceItemService");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const InvoiceItemDto = require("../dto/invoiceItemDto");

exports.getAllInvoiceItems = catchAsync(async (req, res, next) => {
  const query = { ...req.query };
  const invoiceItems = await invoiceItemService.getAllInvoiceItems(query);
  const invoiceItemsDto = invoiceItems.map(
    (invoiceItem) => new InvoiceItemDto(invoiceItem)
  );

  res.status(200).json({
    status: "success",
    length: invoiceItemsDto.length,
    data: {
      invoiceItems: invoiceItemsDto,
    },
  });
});

exports.createInvoiceItem = catchAsync(async (req, res, next) => {
  const invoiceItemData = req.body;
  const invoiceItem = await invoiceItemService.createInvoiceItem(
    invoiceItemData
  );
  const invoiceItemDto = new InvoiceItemDto(invoiceItem);

  res.status(201).json({
    status: "success",
    data: {
      invoiceItem: invoiceItemDto,
    },
  });
});

exports.getInvoiceItem = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const invoiceItem = await invoiceItemService.getInvoiceItem(id);
  const invoiceItemDto = new invoiceItemDto(invoiceItem);

  if (!invoiceItem) {
    throw new AppError("No invoiceItem with this id", 400);
  }
  res.status(200).json({
    status: "success",
    data: {
      invoiceItem: invoiceItemDto,
    },
  });
});

exports.updateInvoiceItem = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const invoiceItemData = req.body;
  const message = await invoiceItemService.updateInvoiceItem(
    id,
    invoiceItemData
  );
  res.status(204).json({
    status: "success",
    message,
  });
});

exports.deleteInvoiceItem = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const message = await invoiceItemService.deleteInvoiceItem(id);
  res.status(204).json({
    status: "success",
    message,
  });
});

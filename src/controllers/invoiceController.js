// import files
const invoiceService = require("../services/invoiceService");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const InvoiceDto = require("../dto/invoiceDto");

exports.getAllInvoices = catchAsync(async (req, res, next) => {
  const query = { ...req.query };
  const invoices = await invoiceService.getAllInvoices(query);
  const invoicesDto = invoices.map((invoice) => new InvoiceDto(invoice));

  res.status(200).json({
    status: "success",
    length: invoicesDto.length,
    data: {
      invoices: invoicesDto,
    },
  });
});

exports.createInvoice = catchAsync(async (req, res, next) => {
  const invoiceData = req.body;
  const { invoice, invoicePDFPath } = await invoiceService.createInvoice(
    invoiceData
  );

  const invoiceDto = new InvoiceDto(invoice);

  res.status(201).json({
    status: "success",
    data: {
      invoice: invoiceDto,
      invoicePDFPath: invoicePDFPath,
    },
  });
});

exports.getInvoice = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const invoice = await invoiceService.getInvoice(id);
  const invoiceDto = new invoiceDto(invoice);

  if (!invoice) {
    throw new AppError("No invoice with this id", 400);
  }
  res.status(200).json({
    status: "success",
    data: {
      invoice: invoiceDto,
    },
  });
});

exports.downloadInvoicePDF = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename="invoice.pdf"`);

  const fileStream = await invoiceService.downloadInvoicePDF(id);

  fileStream.pipe(res);
});

exports.updateInvoice = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const invoiceData = req.body;
  const message = await invoiceService.updateInvoice(id, invoiceData);
  res.status(204).json({
    status: "success",
    message,
  });
});

exports.deleteInvoice = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const message = await invoiceService.deleteInvoice(id);
  res.status(204).json({
    status: "success",
    message,
  });
});

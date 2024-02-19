class InvoiceDto {
  constructor(invoice) {
    this.id = invoice.id;
    this.invoiceNumber = invoice.invoiceNumber;
    this.date = invoice.date;
    this.clientId = invoice.clientId;
    this.orderId = invoice.orderId;
    this.InvoiceTotalPrice = invoice.InvoiceTotalPrice;
  }
}

module.exports = InvoiceDto;

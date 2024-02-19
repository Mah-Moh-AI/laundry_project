class InvoiceItemDto {
  constructor(invoiceItem) {
    this.id = invoiceItem.id;
    this.invoiceId = invoiceItem.invoiceId;
    this.serviceId = invoiceItem.serviceId;
    this.itemQuantity = invoiceItem.itemQuantity;
    this.itemPrice = invoiceItem.itemPrice; // shall be deleted. to be checked
    this.itemTotalPrice = invoiceItem.itemTotalPrice;
  }
}

module.exports = InvoiceItemDto;

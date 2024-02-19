const { fs, PDFDocument, path } = require("../utils/npmPackages");

// invoiceData = {id, invoiceNumber, date, clientId, clientName, orderId, InvoiceTotalPrice }
// invoiceItems = [{id, invoiceId, serviceId, serviceName, itemQuantity, itemPrice, itemTotalPrice}, {}, {}]

class CreateInvoice {
  constructor(invoiceData, invoiceItems) {
    this.invoiceData = invoiceData;
    this.invoiceItems = invoiceItems;
    this.publicFolderPath = path.resolve("./public/data/invoices");
    // Create public folder if it doesn't exist
    if (!fs.existsSync(this.publicFolderPath)) {
      fs.mkdirSync(this.publicFolderPath);
    }
    this.invoiceFilePath = path.join(
      this.publicFolderPath,
      `invoice-${this.invoiceData.invoiceNumber}.pdf`
    );
    this.logo = path.resolve("./public/data/logos/logo1.png");
  }

  createPDFFile() {
    // Create a writable stream to save the PDF file
    const output = fs.createWriteStream(this.invoiceFilePath);

    // Create a PDF document
    const doc = new PDFDocument();

    // Pipe the PDF document to the file stream
    doc.pipe(output);
    console.log(doc.page.width);
    // Add invoice background and logo
    // doc.rect(0, 0, doc.page.width, doc.page.height).fill("#f0f0f0");
    doc.fillColor("blue");
    doc.image(this.logo, doc.page.width - 150, 50, { width: 100 });

    // Add invoice title
    doc.fontSize(24).text("Invoice", { align: "center" });

    // Add table with invoice header
    doc
      .moveDown()
      .fontSize(12)
      .text(`Invoice Number: ${this.invoiceData.invoiceNumber}`);
    doc.text(`Date: ${this.invoiceData.date.toLocaleDateString("en-US")}`);
    doc.text(`Client: ${this.invoiceData.clientName}`);

    // Add table with items
    doc
      .moveDown()
      .fontSize(14)
      .text("Invoice Items", { underline: true, align: "center" });

    // doc.table({
    //   headers: ["Service", "Quantity", "Price", "Total"],
    //   //   body: this.invoiceItems.map((item) => [
    //   //     item.serviceName,
    //   //     item.itemQuantity,
    //   //     item.itemPrice,
    //   //     item.itemTotalPrice,
    //   //   ]),
    // });

    // 3.5) Add table with total
    const totalPrice = this.invoiceItems.reduce(
      (acc, item) => acc + item.itemTotalPrice,
      0
    );
    doc.moveDown().text(`Total: ${totalPrice}`);

    // 3.6) Add invoice fotter
    doc.end();

    return this.invoiceFilePath;
  }

  // create invoice function
  async createInvoice() {
    // call a function to create invoice PDF
    const invoicePDF = await this.createPDFFile();

    // return pdf file name and location
    return invoicePDF;
  }
}

module.exports = CreateInvoice;

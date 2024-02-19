const { fs, PDFDocument, path } = require("../utils/npmPackages");

// invoiceData = {id, invoiceNumber, date, clientId, clientName, orderId, InvoiceTotalPrice }
// invoiceItems = [{id, , serviceName, itemQuantity, itemPrice, itemTotalPrice}, {}, {}]

// several bugs shall be resolved
const createInvoicePdf = (invoiceData, invoiceItems) => {
  let doc = new PDFDocument({ size: "A4", margin: 50 });
  generateHeader(doc);
  generateCustomerInformation(doc, invoiceData);
  generateInvoiceTable(doc, invoiceData, invoiceItems);
  generateFooter(doc);

  doc.end();

  // save pdf in a defined path
  const publicFolderPath = path.resolve("./public/data/invoices");

  // Create public folder if it doesn't exist
  if (!fs.existsSync(publicFolderPath)) {
    fs.mkdirSync(publicFolderPath);
  }

  // define invoice name
  const invoiceFilePath = path.join(
    publicFolderPath,
    `invoice-${invoiceData.id}.pdf`
  );

  doc.pipe(fs.createWriteStream(invoiceFilePath));

  return invoiceFilePath;
};

function generateHeader(doc) {
  const logo = path.resolve("./public/logos/logo1.png");

  doc
    .image(logo, 50, 45, { width: 50 })
    .fillColor("#444444")
    .fontSize(20)
    .text("Cairo Laundary Inc.", 110, 57)
    .fontSize(10)
    .text("123 Main Street", 200, 65, { align: "right" })
    .text("Nasr City, Cairo, 111111", 200, 80, { align: "right" })
    .moveDown()
    .fontSize(24)
    .text("Invoice", 250, 120, { align: "center", width: 150 })
    .moveDown();
}

function generateFooter(doc) {
  doc
    .fontSize(10)
    .text(
      "Company and taxes details shall be added in the footer for reference.",
      50,
      780,
      { align: "center", width: 500 }
    );
}

function generateCustomerInformation(doc, invoiceData) {
  // invoiceData = {id, invoiceNumber, date, clientId, clientName, orderId, InvoiceTotalPrice }
  generateHr(doc, 145);

  doc
    .fontSize(12)
    .text(`Invoice Number: ${invoiceData.invoiceNumber}`, 50, 160)
    .text(
      `Invoice Date: ${invoiceData.date.toLocaleDateString("en-US")}`,
      50,
      175
    )
    .text(`Customer Name: ${invoiceData.clientName}`, 50, 190)
    .text(`Customer Address: ${invoiceData.clientAddress}`, 50, 205)
    .moveDown();

  generateHr(doc, 220);
}

function generateInvoiceTable(doc, invoiceData, invoiceItems) {
  let i,
    invoiceTableTop = 250;

  doc.font("Helvetica-Bold");
  generateTableRow(
    doc,
    invoiceTableTop,
    "Item",
    "Description",
    "Unit Cost",
    "Quantity",
    "Total"
  );

  generateHr(doc, invoiceTableTop + 20);
  doc.font("Helvetica");
  // invoiceItems = [{id, invoiceId, serviceId, serviceName, itemQuantity, itemPrice, itemTotalPrice}, {}, {}]
  for (i = 0; i < invoiceItems.length; i++) {
    const item = invoiceItems[i];
    const position = invoiceTableTop + (i + 1) * 30;
    generateTableRow(
      doc,
      position,
      i + 1,
      item.serviceName,
      item.itemPrice,
      item.itemQuantity,
      item.itemTotalPrice
    );
    generateHr(doc, position + 20);
  }

  const subtotalPosition = invoiceTableTop + (i + 1) * 30;

  generateTableRow(
    doc,
    subtotalPosition,
    "",
    "",
    "Subtotal",
    "",
    invoiceData.InvoiceTotalPrice
  );
}

// draw line function
function generateHr(doc, y) {
  doc
    .strokeColor("#aaaaaa") // Set the stroke color to light gray
    .lineWidth(1) // Set the line width to 1
    .moveTo(50, y) // Move to the starting point (x=50, y)
    .lineTo(550, y) // Draw a line to the ending point (x=550, y)
    .stroke(); // Stroke (draw) the line
}

function generateTableRow(
  doc,
  y,
  item,
  description,
  unitCost,
  quantity,
  lineTotal
) {
  doc
    .fontSize(10)
    .text(item, 50, y)
    .text(description, 150, y)
    .text(unitCost, 280, y, { width: 90, align: "right" })
    .text(quantity, 370, y, { width: 90, align: "right" })
    .text(lineTotal, 0, y, { align: "right" });
}

module.exports = createInvoicePdf;

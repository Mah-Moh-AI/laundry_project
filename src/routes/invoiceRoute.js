// import files
const npmPackages = require("../utils/npmPackages");

// import npm
const { express } = npmPackages;

// import Controllers
const invoiceController = require("../controllers/invoiceController");
const { protect } = require("../services/authService");

// create Router
const router = express.Router();

// CRUD operations
router
  .route("/")
  .get(invoiceController.getAllInvoices)
  .post(invoiceController.createInvoice);

router.route("/invoicePdf/:id").get(invoiceController.downloadInvoicePDF);

router
  .route("/:id")
  .get(invoiceController.getInvoice)
  .delete(invoiceController.deleteInvoice)
  .patch(invoiceController.updateInvoice);

module.exports = router;

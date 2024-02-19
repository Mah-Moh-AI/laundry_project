// import files
const npmPackages = require("../utils/npmPackages");

// import npm
const { express } = npmPackages;

// import Controllers
const invoiceItemController = require("../controllers/invoiceItemController");
const { protect } = require("../services/authService");

// create Router
const router = express.Router();

// CRUD operations
router
  .route("/")
  .get(invoiceItemController.getAllInvoiceItems)
  .post(invoiceItemController.createInvoiceItem);

router
  .route("/:id")
  .get(invoiceItemController.getInvoiceItem)
  .delete(invoiceItemController.deleteInvoiceItem)
  .patch(invoiceItemController.updateInvoiceItem);

module.exports = router;

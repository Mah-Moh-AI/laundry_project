// import files
const npmPackages = require("../utils/npmPackages");

// import npm
const { express } = npmPackages;

// import Controllers
const deliveryWorkerController = require("../controllers/deliveryWorkerController");
const { protect } = require("../services/authService");

// create Router
const router = express.Router();

// CRUD operations
router
  .route("/")
  .get(deliveryWorkerController.getAllDeliveryWorkers)
  .post(deliveryWorkerController.createDeliveryWorker);

router
  .route("/:id")
  .get(deliveryWorkerController.getDeliveryWorker)
  .delete(deliveryWorkerController.deleteDeliveryWorker)
  .patch(deliveryWorkerController.updateDeliveryWorker);

module.exports = router;

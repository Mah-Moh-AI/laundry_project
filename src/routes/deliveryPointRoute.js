// import files
const npmPackages = require("../utils/npmPackages");

// import npm
const { express } = npmPackages;

// import Controllers
const deliveryPointController = require("../controllers/deliveryPointController");
const { protect } = require("../services/authService");

// create Router
const router = express.Router();

// CRUD operations
router
  .route("/")
  .get(deliveryPointController.getAllDeliveryPoints)
  .post(deliveryPointController.createDeliveryPoint);

router
  .route("/:id")
  .get(deliveryPointController.getDeliveryPoint)
  .delete(deliveryPointController.deleteDeliveryPoint)
  .patch(deliveryPointController.updateDeliveryPoint);

module.exports = router;

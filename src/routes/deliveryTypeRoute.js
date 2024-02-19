// import files
const npmPackages = require("../utils/npmPackages");

// import npm
const { express } = npmPackages;

// import Controllers
const deliveryTypeController = require("../controllers/deliveryTypeController");
const { protect } = require("../services/authService");

// create Router
const router = express.Router();

// CRUD operations
router
  .route("/")
  .get(deliveryTypeController.getAllDeliveryTypes)
  .post(deliveryTypeController.createDeliveryType);

router
  .route("/:id")
  .get(deliveryTypeController.getDeliveryType)
  .delete(deliveryTypeController.deleteDeliveryType)
  .patch(deliveryTypeController.updateDeliveryType);

module.exports = router;

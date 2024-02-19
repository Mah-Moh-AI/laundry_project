// import files
const npmPackages = require("../utils/npmPackages");

// import npm
const { express } = npmPackages;

// import Controllers
const deliveryRoutingController = require("../controllers/deliveryRoutingController");
const { protect } = require("../services/authService");

// create Router
const router = express.Router();

// CRUD operations
router
  .route("/optimizedRoute")
  .get(deliveryRoutingController.getOptimizedRouting);

router
  .route("/")
  .get(deliveryRoutingController.getAllDeliveryRoutings)
  .post(deliveryRoutingController.createDeliveryRouting);

router
  .route("/:id")
  .get(deliveryRoutingController.getDeliveryRouting)
  .delete(deliveryRoutingController.deleteDeliveryRouting)
  .patch(deliveryRoutingController.updateDeliveryRouting);

module.exports = router;

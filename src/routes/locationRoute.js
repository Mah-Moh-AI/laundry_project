// import files
const npmPackages = require("../utils/npmPackages");

// import npm
const { express } = npmPackages;

// import Controllers
const locationController = require("../controllers/locationController");
const { protect } = require("../services/authService");

// create Router
const router = express.Router();

// Google maps test Route
router.route("/distance-time").get(locationController.getDistanceTime);

// CRUD operations
router
  .route("/")
  .get(locationController.getAllLocations)
  .post(locationController.createLocation);

router
  .route("/:id")
  .get(locationController.getLocation)
  .delete(locationController.deleteLocation)
  .patch(locationController.updateLocation);

module.exports = router;

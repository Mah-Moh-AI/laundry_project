// import files
const npmPackages = require("../utils/npmPackages");

// import npm
const { express } = npmPackages;

// import Controllers
const servicePreferenceController = require("../controllers/servicePreferenceController");
const { protect } = require("../services/authService");

// create Router
const router = express.Router();

// CRUD operations
router
  .route("/")
  .get(servicePreferenceController.getAllServicePreferences)
  .post(servicePreferenceController.createServicePreference);

router
  .route("/:id")
  .get(servicePreferenceController.getServicePreference)
  .delete(servicePreferenceController.deleteServicePreference)
  .patch(servicePreferenceController.updateServicePreference);

module.exports = router;

// import files
const npmPackages = require("../utils/npmPackages");

// import npm
const { express } = npmPackages;

// import Controllers
const serviceOptionController = require("../controllers/serviceOptionController");
const { protect } = require("../services/authService");

// create Router
const router = express.Router();

// CRUD operations
router
  .route("/")
  .get(serviceOptionController.getAllServiceOptions)
  .post(serviceOptionController.createServiceOption);

router
  .route("/:id")
  .get(serviceOptionController.getServiceOption)
  .delete(serviceOptionController.deleteServiceOption)
  .patch(serviceOptionController.updateServiceOption);

module.exports = router;

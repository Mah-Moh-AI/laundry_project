// import files
const npmPackages = require("../utils/npmPackages");

// import npm
const { express } = npmPackages;

// import Controllers
const serviceController = require("../controllers/serviceController");
const { protect } = require("../services/authService");

// create Router
const router = express.Router();

// CRUD operations
router
  .route("/")
  .get(serviceController.getAllServices)
  .post(serviceController.createService);

router
  .route("/:id")
  .get(serviceController.getService)
  .delete(serviceController.deleteService)
  .patch(serviceController.updateService);

module.exports = router;

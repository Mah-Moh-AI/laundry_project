// import files
const npmPackages = require("../utils/npmPackages");

// import npm
const { express } = npmPackages;

// import Controllers
const itemServiceController = require("../controllers/itemServiceController");
const { protect } = require("../services/authService");

// create Router
const router = express.Router();

// CRUD operations
router
  .route("/")
  .get(itemServiceController.getAllItemServices)
  .post(itemServiceController.createItemService);

router
  .route("/:id")
  .get(itemServiceController.getItemService)
  .delete(itemServiceController.deleteItemService)
  .patch(itemServiceController.updateItemService);

module.exports = router;

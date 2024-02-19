// import files
const npmPackages = require("../utils/npmPackages");
const catchAsync = require("../utils/catchAsync");

// import npm
const { express } = npmPackages;

// import Controllers
const operatorController = require("../controllers/operatorController");
const { protect } = require("../services/authService");

// create Router
const router = express.Router();

// CRUD operations
router
  .route("/")
  .get(operatorController.getAllOperators)
  .post(operatorController.createOperator);

router
  .route("/:id")
  .get(operatorController.getOperator)
  .delete(operatorController.deleteOperator)
  .patch(operatorController.updateOperator);

module.exports = router;

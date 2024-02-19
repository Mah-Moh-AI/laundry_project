// import files
const npmPackages = require("../utils/npmPackages");
const catchAsync = require("../utils/catchAsync");

// import npm
const { express } = npmPackages;

// import Controllers
const clientController = require("../controllers/clientController");
const { protect } = require("../services/authService");

// create Router
const router = express.Router();

// CRUD operations
router
  .route("/")
  .get(clientController.getAllClients)
  .post(clientController.createClient);

router
  .route("/:id")
  .get(clientController.getClient)
  .delete(clientController.deleteClient)
  .patch(clientController.updateClient);

module.exports = router;

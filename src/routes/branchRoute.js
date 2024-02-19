// import files
const npmPackages = require("../utils/npmPackages");
const catchAsync = require("../utils/catchAsync");

// import npm
const { express } = npmPackages;

// import Controllers
const branchController = require("../controllers/branchController");

// create Router
const router = express.Router();

router
  .route("/")
  .get(branchController.getAllBranches)
  .post(branchController.createBranch);

router
  .route("/:id")
  .get(branchController.getBranch)
  .delete(branchController.deleteBranch)
  .patch(branchController.updateBranch);

module.exports = router;

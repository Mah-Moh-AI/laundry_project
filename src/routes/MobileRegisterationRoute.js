// import files
const npmPackages = require("../utils/npmPackages");
const catchAsync = require("../utils/catchAsync");

// import npm
const { express } = npmPackages;

// import Controllers
const mobileRegisterationController = require("../controllers/mobileRegisterationController");

// create Router
const router = express.Router();

router
  .route("/register")
  .post(mobileRegisterationController.registerMobileNumber);

router
  .route("/verify/:id")
  .patch(mobileRegisterationController.verifyMobileNumber);

module.exports = router;

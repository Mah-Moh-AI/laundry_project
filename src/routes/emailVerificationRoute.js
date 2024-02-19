// import files
const npmPackages = require("../utils/npmPackages");
const catchAsync = require("../utils/catchAsync");

// import npm
const { express } = npmPackages;

// import Controllers
const emailVerificationController = require("../controllers/emailVerificationController");

// create Router
const router = express.Router();

router
  .route("/token/:id")
  .patch(emailVerificationController.sendVerificationEmail);

router
  .route("/verifyemail/:token")
  .patch(emailVerificationController.verifyEmail);

module.exports = router;

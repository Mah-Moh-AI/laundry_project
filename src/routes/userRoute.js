// import files
const npmPackages = require("../utils/npmPackages");
const catchAsync = require("../utils/catchAsync");

// import npm
const { express } = npmPackages;

// import Controllers
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");
const { protect } = require("../services/authService");
// create Router
const router = express.Router();

router.route("/signin/").post(authController.signin);
router.route("/signup/:id").post(authController.signup);
router.route("/forgotpassword").post(authController.forgotPassword);
router.route("/resetPassword/:token").post(authController.resetPassword);

// router.use(
//   authController.protect,
//   authController.strictTo("client", "operator")
// );

router.route("/updateMyPassword").patch(authController.updatePassword);

router
  .route("/")
  .get(userController.getAllUsers)
  .post(userController.createUser);

router
  .route("/:id")
  .get(userController.getUser)
  .delete(userController.deleteUser)
  .patch(userController.updateUser);

module.exports = router;

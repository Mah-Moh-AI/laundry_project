// import files
const npmPackages = require("../utils/npmPackages");
const catchAsync = require("../utils/catchAsync");
// import npm
const { express } = npmPackages;

// create Router
const router = express.Router();

router.route("/test").get(
  catchAsync(async (req, res, next) => {
    res.status(200).json({
      status: "success",
      data: "Hello from API",
    });
  })
);

module.exports = router;

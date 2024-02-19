// import files
const npmPackages = require("../utils/npmPackages");

// import npm
const { express } = npmPackages;

// import Controllers
const clothesTypeController = require("../controllers/clothesTypesController");
const { protect } = require("../services/authService");

// create Router
const router = express.Router();

// CRUD operations
router
  .route("/")
  .get(clothesTypeController.getAllClothesTypes)
  .post(clothesTypeController.createClothesType);

router
  .route("/:id")
  .get(clothesTypeController.getClothesType)
  .delete(clothesTypeController.deleteClothesType)
  .patch(clothesTypeController.updateClothesType);

module.exports = router;

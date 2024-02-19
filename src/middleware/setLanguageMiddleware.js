const catchAsync = require("../utils/catchAsync");
const { i18next } = require("../utils/npmPackages");
module.exports = catchAsync(async (req, res, next) => {
  i18next.changeLanguage("en"); // this value shall be dynamic
  console.log(req);
  next();
});

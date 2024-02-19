// import files
const mobileRegisterationService = require("../services/mobileRegisterationService");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const UserDto = require("../dto/userDto");
const logger = require("../logging/index");
const signToken = require("../utils/signToken");
const { JWT_COOKIE_EXPIRES_IN, NODE_ENV } = require("../config/env");
const { jwt, crypto } = require("../utils/npmPackages");
const Email = require("../jobs/emailJob");

// register and verify Mobile Number
exports.registerMobileNumber = catchAsync(async (req, res, next) => {
  const { mobileNumber } = req.body;

  const user = await mobileRegisterationService.registerMobileNumber(
    mobileNumber
  );
  const userDto = new UserDto(user);
  res.status(200).json({
    status: "success",
    data: userDto,
  });
});

exports.verifyMobileNumber = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { verificationNumber } = req.body;
  console.log(id, verificationNumber);
  const userMobileVerification =
    await mobileRegisterationService.verifyMobileNumber(id, verificationNumber);

  res.status(200).json({
    status: "success",
    message: userMobileVerification,
  });
});

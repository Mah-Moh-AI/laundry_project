// import files
const emailVerificationService = require("../services/emailVerificationService");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const UserDto = require("../dto/userDto");
const logger = require("../logging/index");
const signToken = require("../utils/signToken");
const { JWT_COOKIE_EXPIRES_IN, NODE_ENV } = require("../config/env");
const { jwt, crypto } = require("../utils/npmPackages");
const Email = require("../jobs/emailJob");

exports.sendVerificationEmail = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const verificationUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/email/verifyemail/`;

  const message = await emailVerificationService.sendVerificationUrlEmail(
    id,
    verificationUrl
  );

  res.status(200).json({
    status: "success",
    message,
  });
});

exports.verifyEmail = catchAsync(async (req, res, next) => {
  const { token } = req.params;

  const message = await emailVerificationService.verifyUrl(token);

  res.status(200).json({
    status: "success",
    message,
  });
});

// import files
const authService = require("../services/authService");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const UserDto = require("../dto/userDto");
const logger = require("../logging/index");
const signToken = require("../utils/signToken");
const { JWT_COOKIE_EXPIRES_IN, NODE_ENV } = require("../config/env");
const { jwt, crypto } = require("../utils/npmPackages");
const Email = require("../jobs/emailJob");

// sign-up is allowed only for clients
exports.signup = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const userData = req.body;

  const [user, token, cookieOptions] = await authService.signup(id, userData);

  // assign to DTO
  const userDto = new UserDto(user);

  res.cookie("jwt", token, cookieOptions);

  res.status(200).json({
    status: "success",
    token,
    data: {
      user: userDto,
    },
  });
});

exports.signin = catchAsync(async (req, res, next) => {
  const { mobileNumber, password } = req.body;

  const [user, token, cookieOptions, notification] = await authService.signin(
    mobileNumber,
    password
  );

  // assign to DTO
  const userDto = new UserDto(user);

  res.cookie("jwt", token, cookieOptions);

  res.status(200).json({
    status: "success",
    token,
    notification,
    data: {
      user: userDto,
    },
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  const { authorization } = req.headers;
  const { jwt } = req.cookies;
  const user = await authService.protect(authorization, jwt);

  // 5) Grant access to pretected route
  req.user = user;
  next();
});

exports.strictTo =
  (...roles) =>
  (req, res, next) => {
    const { role } = req.user;
    authService.strictTo(role, next, ...roles);
    next();
  };

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const { mobileNumber } = req.body;
  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/users/resetpassword/`;

  const message = await authService.forgotPassword(
    mobileNumber,
    resetUrl,
    next
  );

  res.status(200).json({
    status: "success",
    message,
  });
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const { token } = req.params;
  const { password } = req.body;

  const [user, newToken, cookieOptions] = await authService.resetPassword(
    token,
    password
  );
  const userDto = new UserDto(user);
  res.cookie("jwt", token, cookieOptions);

  res.status(200).json({
    status: "success",
    token: newToken,
    data: {
      user: userDto,
    },
  });
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  const { id } = req.user;
  const { password, newPassword } = req.body;

  const [user, token, cookieOptions] = await authService.updatePassword(
    id,
    password,
    newPassword
  );

  const userDto = new UserDto(user);

  res.cookie("jwt", token, cookieOptions);

  res.status(200).json({
    status: "success",
    token,
    data: {
      user: userDto,
    },
  });
});

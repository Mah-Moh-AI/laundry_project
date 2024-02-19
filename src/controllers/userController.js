// import files
const userService = require("../services/userService");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const UserDto = require("../dto/userDto");
const logger = require("../logging/index");
const { t } = require("../utils/npmPackages").i18next;

// CRUD operations
exports.getAllUsers = catchAsync(async (req, res, next) => {
  const query = { ...req.query };

  const users = await userService.getAllUsers(query);
  const usersDto = users.map((user) => new UserDto(user));
  res.status(200).json({
    status: t("status.success"),
    length: usersDto.length,
    data: {
      users: usersDto,
    },
  });
});

exports.createUser = catchAsync(async (req, res, next) => {
  const userData = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    role: req.body.role,
    branch: req.body.branch,
    mobileNumber: req.body.mobileNumber,
  };

  const user = await userService.createUser(userData);
  const userDto = new UserDto(user);

  res.status(201).json({
    status: "success",
    data: {
      user: userDto,
    },
  });
});

exports.getUser = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const user = await userService.getUser(id);
  if (!user) {
    throw new AppError("No user with this id", 400);
  }
  const userDto = new UserDto(user);

  res.status(200).json({
    status: "success",
    data: {
      user: userDto,
    },
  });
});

exports.updateUser = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const userData = req.body;
  console.log("userController: ", userData);
  const message = await userService.updateUser(id, userData);
  res.status(204).json({
    status: "success",
    message,
  });
});

exports.deleteUser = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const message = await userService.deleteUser(id);
  res.status(204).json({
    status: "success",
    message,
  });
});

// const userData = Object.fromEntries(
//   Object.entries({
//     name: req.body.name,
//     role: req.body.role,
//     branch: req.body.branch,
//   }).filter(([_, value]) => value !== undefined)
// );
// console.log(userData);

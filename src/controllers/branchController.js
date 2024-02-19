// import files
const branchService = require("../services/branchService");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const BranchDto = require("../dto/branchDto");

exports.getAllBranches = catchAsync(async (req, res, next) => {
  const query = { ...req.query };
  const branches = await branchService.getAllBranches(query);
  const branchesDto = branches.map((branch) => new BranchDto(branch));

  res.status(200).json({
    status: "success",
    length: branchesDto.length,
    data: {
      branches: branchesDto,
    },
  });
});

exports.createBranch = catchAsync(async (req, res, next) => {
  const branchData = req.body;
  const branch = await branchService.createBranch(branchData);
  const branchDto = new BranchDto(branch);

  res.status(201).json({
    status: "success",
    data: {
      branch: branchDto,
    },
  });
});

exports.getBranch = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const branch = await branchService.getBranch(id);
  const branchDto = new BranchDto(branch);

  if (!branch) {
    throw new AppError("No branch with this id", 400);
  }
  res.status(200).json({
    status: "success",
    data: {
      branch: branchDto,
    },
  });
});

exports.updateBranch = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const branchData = req.body;
  const message = await branchService.updateBranch(id, branchData);
  res.status(204).json({
    status: "success",
    message,
  });
});

exports.deleteBranch = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const message = await branchService.deleteBranch(id);
  res.status(204).json({
    status: "success",
    message,
  });
});

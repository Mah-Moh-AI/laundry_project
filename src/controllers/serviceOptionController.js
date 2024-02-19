// import files
const serviceOptionService = require("../services/serviceOptionService");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const ServiceOptionDto = require("../dto/serviceOptionDto");

exports.getAllServiceOptions = catchAsync(async (req, res, next) => {
  const query = { ...req.query };
  const serviceOptions = await serviceOptionService.getAllServiceOptions(query);
  const serviceOptionsDto = serviceOptions.map(
    (serviceOption) => new ServiceOptionDto(serviceOption)
  );

  res.status(200).json({
    status: "success",
    length: serviceOptionsDto.length,
    data: {
      serviceOptions: serviceOptionsDto,
    },
  });
});

exports.createServiceOption = catchAsync(async (req, res, next) => {
  const serviceOptionData = req.body;
  const serviceOption = await serviceOptionService.createServiceOption(
    serviceOptionData
  );
  const serviceOptionDto = new ServiceOptionDto(serviceOption);

  res.status(201).json({
    status: "success",
    data: {
      serviceOption: serviceOptionDto,
    },
  });
});

exports.getServiceOption = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const serviceOption = await serviceOptionService.getServiceOption(id);
  const serviceOptionDto = new serviceOptionDto(serviceOption);

  if (!serviceOption) {
    throw new AppError("No serviceOption with this id", 400);
  }
  res.status(200).json({
    status: "success",
    data: {
      serviceOption: serviceOptionDto,
    },
  });
});

exports.updateServiceOption = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const serviceOptionData = req.body;
  const message = await serviceOptionService.updateServiceOption(
    id,
    serviceOptionData
  );
  res.status(204).json({
    status: "success",
    message,
  });
});

exports.deleteServiceOption = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const message = await serviceOptionService.deleteServiceOption(id);
  res.status(204).json({
    status: "success",
    message,
  });
});

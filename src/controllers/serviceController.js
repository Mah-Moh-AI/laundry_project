// import files
const serviceService = require("../services/serviceService");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const ServiceDto = require("../dto/serviceDto");

exports.getAllServices = catchAsync(async (req, res, next) => {
  const query = { ...req.query };
  const services = await serviceService.getAllServices(query);
  const servicesDto = services.map((service) => new ServiceDto(service));

  res.status(200).json({
    status: "success",
    length: servicesDto.length,
    data: {
      services: servicesDto,
    },
  });
});

exports.createService = catchAsync(async (req, res, next) => {
  const serviceData = req.body;
  const service = await serviceService.createService(serviceData);
  const serviceDto = new ServiceDto(service);

  res.status(201).json({
    status: "success",
    data: {
      service: serviceDto,
    },
  });
});

exports.getService = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const service = await serviceService.getService(id);
  const serviceDto = new serviceDto(service);

  if (!service) {
    throw new AppError("No service with this id", 400);
  }
  res.status(200).json({
    status: "success",
    data: {
      service: serviceDto,
    },
  });
});

exports.updateService = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const serviceData = req.body;
  const message = await serviceService.updateService(id, serviceData);
  res.status(204).json({
    status: "success",
    message,
  });
});

exports.deleteService = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const message = await serviceService.deleteService(id);
  res.status(204).json({
    status: "success",
    message,
  });
});

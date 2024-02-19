// import files
const deliveryWorkerService = require("../services/deliveryWorkerService");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const DeliveryWorkerDto = require("../dto/deliveryWorkerDto");

exports.getAllDeliveryWorkers = catchAsync(async (req, res, next) => {
  const query = { ...req.query };
  const deliveryWorkers = await deliveryWorkerService.getAllDeliveryWorkers(
    query
  );
  const deliveryWorkersDto = deliveryWorkers.map(
    (deliveryWorker) => new DeliveryWorkerDto(deliveryWorker)
  );

  res.status(200).json({
    status: "success",
    length: deliveryWorkersDto.length,
    data: {
      deliveryWorkers: deliveryWorkersDto,
    },
  });
});

exports.createDeliveryWorker = catchAsync(async (req, res, next) => {
  const deliveryWorkerData = req.body;
  const deliveryWorker = await deliveryWorkerService.createDeliveryWorker(
    deliveryWorkerData
  );
  const deliveryWorkerDto = new DeliveryWorkerDto(deliveryWorker);

  res.status(201).json({
    status: "success",
    data: {
      deliveryWorker: deliveryWorkerDto,
    },
  });
});

exports.getDeliveryWorker = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const deliveryWorker = await deliveryWorkerService.getDeliveryWorker(id);
  const deliveryWorkerDto = new deliveryWorkerDto(deliveryWorker);

  if (!deliveryWorker) {
    throw new AppError("No deliveryWorker with this id", 400);
  }
  res.status(200).json({
    status: "success",
    data: {
      deliveryWorker: deliveryWorkerDto,
    },
  });
});

exports.updateDeliveryWorker = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const deliveryWorkerData = req.body;
  const message = await deliveryWorkerService.updateDeliveryWorker(
    id,
    deliveryWorkerData
  );
  res.status(204).json({
    status: "success",
    message,
  });
});

exports.deleteDeliveryWorker = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const message = await deliveryWorkerService.deleteDeliveryWorker(id);
  res.status(204).json({
    status: "success",
    message,
  });
});

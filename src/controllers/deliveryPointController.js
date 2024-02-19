// import files
const deliveryPointService = require("../services/deliveryPointService");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const DeliveryPointDto = require("../dto/deliveryPointDto");

exports.getAllDeliveryPoints = catchAsync(async (req, res, next) => {
  const query = { ...req.query };
  const deliveryPoints = await deliveryPointService.getAllDeliveryPoints(query);
  const deliveryPointsDto = deliveryPoints.map(
    (deliveryPoint) => new DeliveryPointDto(deliveryPoint)
  );

  res.status(200).json({
    status: "success",
    length: deliveryPointsDto.length,
    data: {
      deliveryPoints: deliveryPointsDto,
    },
  });
});

exports.createDeliveryPoint = catchAsync(async (req, res, next) => {
  const deliveryPointData = req.body;
  const deliveryPoint = await deliveryPointService.createDeliveryPoint(
    deliveryPointData
  );
  const deliveryPointDto = new DeliveryPointDto(deliveryPoint);

  res.status(201).json({
    status: "success",
    data: {
      deliveryPoint: deliveryPointDto,
    },
  });
});

exports.getDeliveryPoint = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const deliveryPoint = await deliveryPointService.getDeliveryPoint(id);
  const deliveryPointDto = new deliveryPointDto(deliveryPoint);

  if (!deliveryPoint) {
    throw new AppError("No deliveryPoint with this id", 400);
  }
  res.status(200).json({
    status: "success",
    data: {
      deliveryPoint: deliveryPointDto,
    },
  });
});

exports.updateDeliveryPoint = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const deliveryPointData = req.body;
  const message = await deliveryPointService.updateDeliveryPoint(
    id,
    deliveryPointData
  );
  res.status(204).json({
    status: "success",
    message,
  });
});

exports.deleteDeliveryPoint = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const message = await deliveryPointService.deleteDeliveryPoint(id);
  res.status(204).json({
    status: "success",
    message,
  });
});

// import files
const deliveryRoutingService = require("../services/deliveryRoutingService");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const DeliveryRoutingDto = require("../dto/deliveryRoutingDto");
const DeliveryPointsDto = require("../dto/deliveryPointDto");

// 1) calculate best route, distance and expected duration based on defined locations
exports.getOptimizedRouting = catchAsync(async (req, res, next) => {
  const deliveryRoutingData = req.body;
  const deliveryRoute = await deliveryRoutingService.getOptimizedRouting(
    deliveryRoutingData
  );
  res.status(201).json({
    status: "success",
    data: {
      deliveryRoute,
    },
  });
});

// 2) validate best route / create route and send notifications to clients with expected visit time
exports.createDeliveryRouting = catchAsync(async (req, res, next) => {
  const deliveryRoutingData = req.body;
  const {
    deliveryPoints,
    deliveryRoute,
    branchLocation,
    locations,
    messageStatus,
  } = await deliveryRoutingService.createDeliveryRouting(deliveryRoutingData);
  const deliveryRoutingDto = new DeliveryRoutingDto(deliveryRoute);
  const deliveryPointsDto = new DeliveryPointsDto(deliveryPoints);

  res.status(201).json({
    status: "success",
    data: {
      deliveryRouting: deliveryRoutingDto,
      deliveryPoints,
      branchLocation,
      locations,
      messageStatus,
    },
  });
});

// 3) update created route sequence and any further field
// 4) delete created route
// 5) get routes
// 6) get route status including completed visits
// 7) update 1 delivery location visited and delivered or not available
// 8) cancel route in the middle of operation

exports.getAllDeliveryRoutings = catchAsync(async (req, res, next) => {
  const query = { ...req.query };
  const deliveryRoutings = await deliveryRoutingService.getAllDeliveryRoutings(
    query
  );
  const deliveryRoutingsDto = deliveryRoutings.map(
    (deliveryRouting) => new DeliveryRoutingDto(deliveryRouting)
  );

  res.status(200).json({
    status: "success",
    length: deliveryRoutingsDto.length,
    data: {
      deliveryRoutings: deliveryRoutingsDto,
    },
  });
});

exports.getDeliveryRouting = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const deliveryRouting = await deliveryRoutingService.getDeliveryRouting(id);
  const deliveryRoutingDto = new deliveryRoutingDto(deliveryRouting);

  if (!deliveryRouting) {
    throw new AppError("No deliveryRouting with this id", 400);
  }
  res.status(200).json({
    status: "success",
    data: {
      deliveryRouting: deliveryRoutingDto,
    },
  });
});

exports.updateDeliveryRouting = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const deliveryRoutingData = req.body;
  const message = await deliveryRoutingService.updateDeliveryRouting(
    id,
    deliveryRoutingData
  );
  res.status(204).json({
    status: "success",
    message,
  });
});

exports.deleteDeliveryRouting = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const message = await deliveryRoutingService.deleteDeliveryRouting(id);
  res.status(204).json({
    status: "success",
    message,
  });
});

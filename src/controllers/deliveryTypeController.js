// import files
const deliveryTypeService = require("../services/deliveryTypeService");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const DeliveryTypeDto = require("../dto/deliveryTypeDto");

exports.getAllDeliveryTypes = catchAsync(async (req, res, next) => {
  const query = { ...req.query };
  const deliveryTypes = await deliveryTypeService.getAllDeliveryTypes(query);
  const deliveryTypesDto = deliveryTypes.map(
    (deliveryType) => new DeliveryTypeDto(deliveryType)
  );

  res.status(200).json({
    status: "success",
    length: deliveryTypesDto.length,
    data: {
      deliveryTypes: deliveryTypesDto,
    },
  });
});

exports.createDeliveryType = catchAsync(async (req, res, next) => {
  const deliveryTypeData = req.body;
  const deliveryType = await deliveryTypeService.createDeliveryType(
    deliveryTypeData
  );
  const deliveryTypeDto = new DeliveryTypeDto(deliveryType);

  res.status(201).json({
    status: "success",
    data: {
      deliveryType: deliveryTypeDto,
    },
  });
});

exports.getDeliveryType = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const deliveryType = await deliveryTypeService.getDeliveryType(id);
  const deliveryTypeDto = new deliveryTypeDto(deliveryType);

  if (!deliveryType) {
    throw new AppError("No deliveryType with this id", 400);
  }
  res.status(200).json({
    status: "success",
    data: {
      deliveryType: deliveryTypeDto,
    },
  });
});

exports.updateDeliveryType = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const deliveryTypeData = req.body;
  const message = await deliveryTypeService.updateDeliveryType(
    id,
    deliveryTypeData
  );
  res.status(204).json({
    status: "success",
    message,
  });
});

exports.deleteDeliveryType = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const message = await deliveryTypeService.deleteDeliveryType(id);
  res.status(204).json({
    status: "success",
    message,
  });
});

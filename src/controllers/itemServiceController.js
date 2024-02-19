// import files
const itemServiceService = require("../services/itemServiceService");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const ItemServiceDto = require("../dto/itemServiceDto");

exports.getAllItemServices = catchAsync(async (req, res, next) => {
  const query = { ...req.query };
  const itemServices = await itemServiceService.getAllItemServices(query);
  const itemServicesDto = itemServices.map(
    (itemService) => new ItemServiceDto(itemService)
  );

  res.status(200).json({
    status: "success",
    length: itemServicesDto.length,
    data: {
      itemServices: itemServicesDto,
    },
  });
});

exports.createItemService = catchAsync(async (req, res, next) => {
  const itemServiceData = req.body;
  const itemService = await itemServiceService.createItemService(
    itemServiceData
  );
  const itemServiceDto = new ItemServiceDto(itemService);

  res.status(201).json({
    status: "success",
    data: {
      itemService: itemServiceDto,
    },
  });
});

exports.getItemService = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const itemService = await itemServiceService.getItemService(id);
  const itemServiceDto = new itemServiceDto(itemService);

  if (!itemService) {
    throw new AppError("No itemService with this id", 400);
  }
  res.status(200).json({
    status: "success",
    data: {
      itemService: itemServiceDto,
    },
  });
});

exports.updateItemService = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const itemServiceData = req.body;
  const message = await itemServiceService.updateItemService(
    id,
    itemServiceData
  );
  res.status(204).json({
    status: "success",
    message,
  });
});

exports.deleteItemService = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const message = await itemServiceService.deleteItemService(id);
  res.status(204).json({
    status: "success",
    message,
  });
});

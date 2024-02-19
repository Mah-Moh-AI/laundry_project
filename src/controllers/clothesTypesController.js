// import files
const clothesTypeService = require("../services/clothesTypeService");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const ClothesTypeDto = require("../dto/clothesTypeDto");

exports.getAllClothesTypes = catchAsync(async (req, res, next) => {
  const query = { ...req.query };
  const clothesTypes = await clothesTypeService.getAllClothesTypes(query);
  const clothesTypesDto = clothesTypes.map(
    (clothesType) => new ClothesTypeDto(clothesType)
  );

  res.status(200).json({
    status: "success",
    length: clothesTypesDto.length,
    data: {
      clothesTypes: clothesTypesDto,
    },
  });
});

exports.createClothesType = catchAsync(async (req, res, next) => {
  const clothesTypeData = req.body;
  const clothesType = await clothesTypeService.createClothesType(
    clothesTypeData
  );
  const clothesTypeDto = new ClothesTypeDto(clothesType);

  res.status(201).json({
    status: "success",
    data: {
      clothesType: clothesTypeDto,
    },
  });
});

exports.getClothesType = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const clothesType = await clothesTypeService.getClothesType(id);
  const clothesTypeDto = new clothesTypeDto(clothesType);

  if (!clothesType) {
    throw new AppError("No clothesType with this id", 400);
  }
  res.status(200).json({
    status: "success",
    data: {
      clothesType: clothesTypeDto,
    },
  });
});

exports.updateClothesType = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const clothesTypeData = req.body;
  const message = await clothesTypeService.updateClothesType(
    id,
    clothesTypeData
  );
  res.status(204).json({
    status: "success",
    message,
  });
});

exports.deleteClothesType = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const message = await clothesTypeService.deleteClothesType(id);
  res.status(204).json({
    status: "success",
    message,
  });
});

// import files
const servicePreferenceService = require("../services/servicePreferenceService");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const ServicePreferenceDto = require("../dto/servicePreferenceDto");

exports.getAllServicePreferences = catchAsync(async (req, res, next) => {
  const query = { ...req.query };
  const servicePreferences =
    await servicePreferenceService.getAllServicePreferences(query);
  const servicePreferencesDto = servicePreferences.map(
    (servicePreference) => new ServicePreferenceDto(servicePreference)
  );

  res.status(200).json({
    status: "success",
    length: servicePreferencesDto.length,
    data: {
      servicePreferences: servicePreferencesDto,
    },
  });
});

exports.createServicePreference = catchAsync(async (req, res, next) => {
  const servicePreferenceData = req.body;
  const servicePreference =
    await servicePreferenceService.createServicePreference(
      servicePreferenceData
    );
  const servicePreferenceDto = new ServicePreferenceDto(servicePreference);

  res.status(201).json({
    status: "success",
    data: {
      servicePreference: servicePreferenceDto,
    },
  });
});

exports.getServicePreference = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const servicePreference = await servicePreferenceService.getServicePreference(
    id
  );
  const servicePreferenceDto = new servicePreferenceDto(servicePreference);

  if (!servicePreference) {
    throw new AppError("No servicePreference with this id", 400);
  }
  res.status(200).json({
    status: "success",
    data: {
      servicePreference: servicePreferenceDto,
    },
  });
});

exports.updateServicePreference = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const servicePreferenceData = req.body;
  const message = await servicePreferenceService.updateServicePreference(
    id,
    servicePreferenceData
  );
  res.status(204).json({
    status: "success",
    message,
  });
});

exports.deleteServicePreference = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const message = await servicePreferenceService.deleteServicePreference(id);
  res.status(204).json({
    status: "success",
    message,
  });
});

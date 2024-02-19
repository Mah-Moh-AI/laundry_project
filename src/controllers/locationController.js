// import files
const locationService = require("../services/locationService");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const LocationDto = require("../dto/locationDto");

// Google maps API test
///////////////////////
const { axios } = require("../utils/npmPackages");

const { GOOGLE_API_KEY } = require("../config/env");
const googleMapsClient = require("@google/maps").createClient({
  key: GOOGLE_API_KEY,
});

// not used. USe the 2nd function
exports.getDistanceTime1 = catchAsync(async (req, res, next) => {
  const origin = {
    lat: parseFloat("37.377469"),
    lng: parseFloat("-122.065729"),
  };
  const destination = {
    lat: parseFloat("37.734704"),
    lng: parseFloat("-122.475279"),
  };

  googleMapsClient.distanceMatrix(
    {
      origins: [origin],
      destinations: [destination],
      units: "metric",
    },
    (err, response) => {
      if (err) {
        console.error("Errorrrrr!!!");
        res.status(500).json({
          status: err.status,
          error: err,
        });
      }
      console.log(response.json.rows[0].elements[0].distance);
      const { distance, duration } = response.json.rows[0].elements[0];
      res.status(200).json({
        data: {
          distance: distance.text,
          duration: duration.text,
        },
      });
    }
  );
});

exports.getDistanceTime = catchAsync(async (req, res, next) => {
  const origin = "37.377469, -122.065729";
  const destination = "37.734704, -122.475279";

  const origins = [
    "37.377469,-122.065729",
    "37.1234,-122.4567",
    "37.9876,-122.3456",
  ];
  const destinations = [
    "37.734704,-122.475279",
    "38.5678,-121.9876",
    "38.8765,-121.2345",
  ];

  const response = await axios.get(
    "https://maps.googleapis.com/maps/api/distancematrix/json",
    {
      params: {
        units: "metric",
        origins: origins.join("|"),
        destinations: destinations.join("|"),
        key: GOOGLE_API_KEY,
      },
    }
  );
  console.log(response.data.rows[0].elements);
  const { distance, duration } = response.data.rows[0].elements[0];

  res.status(200).json({
    data: {
      distance: distance.text,
      duration: duration.text,
    },
  });
});

// End of Google Maps API test
//////////////////////////////

exports.getAllLocations = catchAsync(async (req, res, next) => {
  const query = { ...req.query };
  const locations = await locationService.getAllLocations(query);
  const locationsDto = locations.map((location) => new LocationDto(location));

  res.status(200).json({
    status: "success",
    length: locationsDto.length,
    data: {
      locations: locationsDto,
    },
  });
});

exports.createLocation = catchAsync(async (req, res, next) => {
  const locationData = req.body;
  const location = await locationService.createLocation(locationData);
  const locationDto = new LocationDto(location);

  res.status(201).json({
    status: "success",
    data: {
      location: locationDto,
    },
  });
});

exports.getLocation = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const location = await locationService.getLocation(id);
  const locationDto = new locationDto(location);

  if (!location) {
    throw new AppError("No location with this id", 400);
  }
  res.status(200).json({
    status: "success",
    data: {
      location: locationDto,
    },
  });
});

exports.updateLocation = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const locationData = req.body;
  const message = await locationService.updateLocation(id, locationData);
  res.status(204).json({
    status: "success",
    message,
  });
});

exports.deleteLocation = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const message = await locationService.deleteLocation(id);
  res.status(204).json({
    status: "success",
    message,
  });
});

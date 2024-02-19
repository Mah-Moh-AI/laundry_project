const { GOOGLE_API_KEY } = require("../config/env");
const { axios } = require("../utils/npmPackages");
const CacheService = require("../utils/distancesCache");

// Create a singleton instance of CacheService with node-cache
const distancesNodeCache = new CacheService();

// no cache -> Faster but expensive
module.exports.calculateDistancesDurations = async function (
  locations,
  batchSize
) {
  const numLocations = locations.length;
  const distances = {};
  const durations = {};

  // get distance from google maps on batches
  for (let i = 0; i < numLocations; i += batchSize) {
    const batchOrigins = locations.slice(i, i + batchSize);
    const batchDestinations = locations.slice(0);

    const response = await axios.get(
      "https://maps.googleapis.com/maps/api/distancematrix/json",
      {
        params: {
          units: "metric",
          origins: batchOrigins
            .map((origin) => `${origin.lat},${origin.lng}`)
            .join("|"),
          destinations: batchDestinations
            .map((destination) => `${destination.lat},${destination.lng}`)
            .join("|"),
          key: GOOGLE_API_KEY,
        },
      }
    );

    // Populate distances object with distance values
    batchOrigins.forEach((origin, originIndex) => {
      distances[origin.name] = {};
      durations[origin.name] = {};

      batchDestinations.forEach((destination, destinationIndex) => {
        const distanceValue =
          response.data.rows[originIndex].elements[destinationIndex].distance
            .value;
        const durationValue =
          response.data.rows[originIndex].elements[destinationIndex].duration
            .value;
        distances[origin.name][destination.name] = distanceValue;
        durations[origin.name][destination.name] = durationValue;
      });
    });
  }
  return { distances, durations };
};

// with cache
module.exports.calculateDistancesDurationsCached = async function (locations) {
  const numLocations = locations.length;
  const distances = {};
  const durations = {};

  // get distance from google maps on batches
  for (let i = 0; i < numLocations; i++) {
    const origin = locations[i];

    for (let j = 0; j < numLocations; j++) {
      const destination = locations[j];
      const key = `${origin.name}_${destination.name}`;
      const cachedDistance = await distancesNodeCache.get(key);

      if (cachedDistance) {
        // Use cached distance
        distances[origin.name] = distances[origin.name] || {};
        distances[origin.name][destination.name] = cachedDistance;
        continue;
      }

      const response = await axios.get(
        "https://maps.googleapis.com/maps/api/distancematrix/json",
        {
          params: {
            units: "metric",
            origins: `${origin.lat},${origin.lng}`,
            destinations: `${destination.lat},${destination.lng}`,
            key: GOOGLE_API_KEY,
          },
        }
      );

      const distanceValue = response.data.rows[0].elements[0].distance.value;
      const durationValue = response.data.rows[0].elements[0].duration.value;

      distances[origin.name] = distances[origin.name] || {};
      distances[origin.name][destination.name] = distanceValue;
      durations[origin.name] = durations[origin.name] || {};
      durations[origin.name][destination.name] = durationValue;

      // Add distance to cache
      await distancesNodeCache.set(key, distanceValue, 7 * 24 * 60 * 60); // save for 1 week
    }
  }
  return { distances, durations };
};

module.exports.lifeLocation = async function () {};

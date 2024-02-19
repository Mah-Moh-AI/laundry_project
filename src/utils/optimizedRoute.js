// Function to find the nearest unvisited location
function findNearestLocation(distances, currentLocation, visitedLocations) {
  let nearestDistance = Infinity;
  let nearestLocation = null;

  for (const location in distances[currentLocation]) {
    if (
      !visitedLocations.includes(location) &&
      distances[currentLocation][location] < nearestDistance
    ) {
      nearestDistance = distances[currentLocation][location];
      nearestLocation = location;
    }
  }

  return nearestLocation;
}

// Function to find the optimized route using the Nearest Neighbor Algorithm
const findOptimizedRoute = (distances, startingLocation) => {
  const route = [startingLocation];
  const visitedLocations = [startingLocation];
  let currentLocation = startingLocation;

  while (visitedLocations.length < Object.keys(distances).length) {
    const nearestLocation = findNearestLocation(
      distances,
      currentLocation,
      visitedLocations
    );
    route.push(nearestLocation);
    visitedLocations.push(nearestLocation);
    currentLocation = nearestLocation;
  }

  // Return to the starting location to complete the loop
  route.push(startingLocation);

  return route;
};

module.exports = findOptimizedRoute;

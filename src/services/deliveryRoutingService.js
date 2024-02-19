const AppError = require("../utils/appError");
const deliveryRoutingRepository = require("../repositories/deliveryRoutingRepository");
const APIFeatures = require("../utils/apiFeatures");
const locationRepository = require("../repositories/locationRepository");
const orderRepository = require("../repositories/orderRepository");
const branchRepository = require("../repositories/branchRepository");
const deliveryPointRepository = require("../repositories/deliveryPointRepository");
const deliveryWorkerRepository = require("../repositories/deliveryWorkerRepository");
const SMS = require("../jobs/SMSJob");

const {
  calculateDistancesDurations,
  calculateDistancesDurationsCached,
} = require("../jobs/googleMaps");
const optimizedRoute = require("../utils/optimizedRoute");

class DeliveryRoutingService {
  async getAllDeliveryRoutings(queryString) {
    const features = new APIFeatures(queryString).features();
    return await deliveryRoutingRepository.getAllDeliveryRoutings(
      features.query
    );
  }

  async getOptimizedRouting(data) {
    const allowedFields = ["orders", "branch", "orderStopTime"];
    Object.keys(data).forEach((key) => {
      if (!allowedFields.includes(key)) {
        throw new AppError(
          `You do not have permission to create field ${key}`,
          403
        );
      }
    });

    // 1) check recieved data
    const { orders, branch, orderStopTime } = data;
    if (!orders || !branch) {
      throw new AppError(
        "Field or more are missing. Please submit orders, branch"
      );
    }

    // 2) get orders data
    if (!Array.isArray(orders)) {
      throw new AppError("orders shall be submitted in array form", 400);
    }
    const ordersData = await orderRepository.getAllOrders({
      where: { id: orders },
    });

    // 3) get branch data
    const branchData = await branchRepository.getBranch(branch);
    if (!branchData.location) {
      throw new AppError(
        `The branch ${branchData.name} location is not retrieved from database. Please check with system admin`,
        400
      );
    }

    // 4) check orders are ready
    ordersData.forEach((element) => {
      if (element.status === "ready for delivery") {
        // 5) in case any order is delivered send an error with delivered orders
        throw new AppError(
          `Order id ${element.id} is not ready for delivery. It is status is ${element.status}`,
          400
        );
      }
    });

    // 6) create locations Array
    let locations = [
      // {name: "", lat: xx, lng: xx }
      {
        name: `${branchData.name} Branch`,
        lat: branchData.location.coordinates[0],
        lng: branchData.location.coordinates[1],
      }, // check that lat and lng are not swapped !!!
    ];
    ordersData.forEach((element) => {
      const loc = {
        name: element.id,
        lat: element.locationFk.locationPoint.coordinates[0],
        lng: element.locationFk.locationPoint.coordinates[1],
      };
      locations.push(loc);
    });

    // 7) get distances from Google Maps distance Matrix API without using cache
    // // // with no cache usage
    // const { distances, durations } = await calculateDistancesDurations(
    //   locations,
    //   20
    // );

    // 8) get distances from Google Maps distance Matrix API using cache
    const { distances, durations } = await calculateDistancesDurationsCached(
      locations
    );

    // 9) create optimized route in available working hours
    const route = optimizedRoute(distances, `${branchData.name} Branch`);

    // 10) calculate estimated route time including 10 minutes stop at each location
    let routeData = [
      { name: `${branchData.name} Branch`, distanceFromLastLocation: 0 },
    ];
    let totalDistance = 0;
    let totalDuration = 0;
    for (let i = 1; i < route.length; i++) {
      const row = {
        orderId: route[i],
        distanceFromLastLocation: distances[route[i - 1]][route[i]],
        timeFromLastLocation: durations[route[i - 1]][route[i]],
      };
      routeData.push(row);
      totalDistance += row.distanceFromLastLocation;
      totalDuration +=
        row.timeFromLastLocation + orderStopTime ? orderStopTime : 10 * 60; // default 10 minutes stop time
    }

    // 10) send optimized route and expected working hours
    return { routeData, totalDistance, totalDuration }; // meters and seconds
  }

  async createDeliveryRouting(data) {
    const allowedFields = ["deliveryWorkerId", "date", "ordersRoute", "branch"];
    Object.keys(data).forEach((key) => {
      if (!allowedFields.includes(key)) {
        throw new AppError(
          `You do not have permission to create field ${key}`,
          403
        );
      }
    });
    // 1a) check recieved data
    const { ordersRoute, branch, deliveryWorkerId, date } = data;
    const ordersQuantity = ordersRoute.length;
    if (!ordersRoute || !branch || !deliveryWorkerId || !date) {
      throw new AppError(
        "Field or more are missing. Please submit orders, branch, deliveryWorkerId and date"
      );
    }
    // 2) get orders data
    if (!Array.isArray(ordersRoute)) {
      throw new AppError("orders shall be submitted in array form", 400);
    }
    const ordersData = await orderRepository.getAllOrders({
      where: { id: ordersRoute },
    });

    // 3) get branch data
    const branchData = await branchRepository.getBranch(branch);
    if (!branchData.location) {
      throw new AppError(
        `The branch ${branchData.name} location is not retrieved from database. Please check with system admin`,
        400
      );
    }

    // 4) check orders are ready
    ordersData.forEach((element) => {
      if (element.status === "ready for delivery") {
        // 5) in case any order is delivered send an error with delivered orders
        throw new AppError(
          `Order id ${element.id} is not ready for delivery. It is status is ${element.status}`,
          400
        );
      }
    });

    // 6) create locations Array
    let locations = [
      // {name: "", lat: xx, lng: xx }
      // check that lat and lng are not swapped !!!
    ];
    ordersData.forEach((element) => {
      const loc = {
        name: element.id,
        lat: element.locationFk.locationPoint.coordinates[0],
        lng: element.locationFk.locationPoint.coordinates[1],
      };
      locations.push(loc);
    });

    // 7) create branch location object
    const branchLocation = {
      name: `${branchData.name} Branch`,
      lat: branchData.location.coordinates[0],
      lng: branchData.location.coordinates[1],
    };

    // 8) create delivery Routing in database
    const deliveryRoute = await deliveryRoutingRepository.createDeliveryRouting(
      { branch, deliveryWorkerId, date, ordersQuantity }
    );

    // 9) create delivery points in database
    let deliveryPointsInputData = [];
    let sequenceNumber = 0;

    ordersRoute.forEach((element) => {
      sequenceNumber += 1;
      const point = {
        deliveryRouteId: deliveryRoute.id,
        orderId: element,
        sequenceNumber,
      };
      deliveryPointsInputData.push(point);
    });

    const deliveryPoints =
      await deliveryPointRepository.bulkCreateDeliveryPoint(
        deliveryPointsInputData
      );

    // 10) get delivery worker data
    const deliveryWorker = await deliveryWorkerRepository.getDeliveryWorker(
      deliveryWorkerId
    );

    // 11) send message to delivery worker
    const message = await new SMS(
      deliveryWorker.mobileNumber
    ).sendDeliveryRouteMessage(deliveryRoute.id);

    if (!message) {
      throw new AppError(
        "Delivery route message is not sent to delivery Worker. Please contact system admin",
        400
      );
    }
    const messageStatus =
      "Delivery route message is sent to delivery Worker successfully.";

    // 11) send optimized route and expected working hours
    return {
      deliveryPoints,
      deliveryRoute,
      branchLocation,
      locations,
      messageStatus,
    };
  }

  async getDeliveryRouting(id) {
    return await deliveryRoutingRepository.getDeliveryRouting(id);
  }

  async updateDeliveryRouting(id, data) {
    const deliveryRouting = await deliveryRoutingRepository.getDeliveryRouting(
      id
    );
    if (!deliveryRouting) {
      throw new AppError("This id don't exist", 400);
    }
    const allowedFields = ["deliveryWorkerId", "date", "ordersQuantity"];
    Object.keys(data).forEach((key) => {
      if (!allowedFields.includes(key)) {
        throw new AppError(
          `You do not have permission to update field ${key}`,
          403
        );
      }
    });
    const [updateStatus] =
      await deliveryRoutingRepository.updateDeliveryRouting(id, data);
    if (updateStatus === 0) {
      return "deliveryRouting is not updated";
    }
    return "deliveryRouting is updated";
  }

  async deleteDeliveryRouting(id) {
    const deliveryRouting = await deliveryRoutingRepository.getDeliveryRouting(
      id
    );
    if (!deliveryRouting) {
      throw new AppError("This id don't exist", 400);
    }
    const [deleteStatus] =
      await deliveryRoutingRepository.deleteDeliveryRouting(id);
    if (deleteStatus === 0) {
      throw new AppError("DeliveryRouting is not soft deleted", 500);
    }
    return "DeliveryRouting is soft deleted";
  }
}

module.exports = new DeliveryRoutingService();

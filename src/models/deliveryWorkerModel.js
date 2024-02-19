const { Sequelize } = require("../utils/npmPackages");
const { DataTypes } = Sequelize;
const sequelize = require("../config/database");
const DeliveryWorkerHistory = require("./deliveryWorkerHistoryModel");

const DeliveryWorker = sequelize.define(
  "DeliveryWorker",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    mobileNumber: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        isNumeric: {
          args: true,
          msg: "The mobile number shall be numeric",
        },
        len: {
          args: [11, 11],
          msg: "Mobile Number Length should be 11 digits",
        },
      },
    },
    currentLocation: {
      type: DataTypes.GEOMETRY("POINT"),
      allowNull: false,
    },
  },
  {
    timestamps: true,
    createdAt: "createdAt",
    updatedAt: "lastUpdatedAt",
    deletedAt: "deletedAt",
    paranoid: true, // for soft delete
  }
);

DeliveryWorker.addScope("active", {
  // check if this scope is required or it is done by default
  where: {
    deletedAt: null,
  },
});

DeliveryWorker.addHook("beforeUpdate", async (deliveryWorker, options) => {
  const changedAttributes = deliveryWorker.changed();
  const previousData = deliveryWorker.previous();
  let historyData;
  // in case of soft delete
  if (changedAttributes.includes("deletedAt")) {
    historyData = {
      deliveryWorkerId: deliveryWorker.id,
      action: "delete",
      previousData: previousData,
      timestamp: new Date(),
    };
  } else {
    // in case of update
    historyData = {
      deliveryWorkerId: deliveryWorker.id,
      action: "update",
      changes: changedAttributes,
      previousData: previousData,
      timestamp: new Date(),
    };
  }
  await DeliveryWorkerHistory.create(historyData);
});

DeliveryWorker.addHook("beforeDestroy", async (deliveryWorker, options) => {
  const previousData = deliveryWorker.previous();

  const historyData = {
    deliveryWorkerId: deliveryWorker.id,
    action: "delete",
    previousData: previousData,
    timestamp: new Date(),
  };

  await DeliveryWorkerHistory.create(historyData);
});

module.exports = DeliveryWorker;

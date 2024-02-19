const { Sequelize } = require("../utils/npmPackages");
const { DataTypes } = Sequelize;
const sequelize = require("../config/database");
const DeliveryPointHistory = require("./deliveryPointHistoryModel");

const DeliveryPoint = sequelize.define(
  "DeliveryPoint",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    deliveryRouteId: {
      type: DataTypes.UUID,
    },
    orderId: {
      type: DataTypes.UUID,
    },
    sequenceNumber: {
      type: DataTypes.INTEGER, // to be calculated
    },
  },
  {
    timestamps: true,
    createdAt: "createdAt",
    updatedAt: "lastUpdatedAt",
    deletedAt: "deletedAt",
    paranoid: true, // for soft delete
    indexes: [
      {
        unique: true,
        fields: ["deliveryRouteId", "sequenceNumber"],
      },
    ],
  }
);

DeliveryPoint.addScope("active", {
  // check if this scope is required or it is done by default
  where: {
    deletedAt: null,
  },
});

DeliveryPoint.addHook("beforeUpdate", async (deliveryPoint, options) => {
  const changedAttributes = deliveryPoint.changed();
  const previousData = deliveryPoint.previous();
  let historyData;
  // in case of soft delete
  if (changedAttributes.includes("deletedAt")) {
    historyData = {
      deliveryPointId: deliveryPoint.id,
      action: "delete",
      previousData: previousData,
      timestamp: new Date(),
    };
  } else {
    // in case of update
    historyData = {
      deliveryPointId: deliveryPoint.id,
      action: "update",
      changes: changedAttributes,
      previousData: previousData,
      timestamp: new Date(),
    };
  }
  await DeliveryPointHistory.create(historyData);
});

DeliveryPoint.addHook("beforeDestroy", async (deliveryPoint, options) => {
  const previousData = deliveryPoint.previous();

  const historyData = {
    deliveryPointId: deliveryPoint.id,
    action: "delete",
    previousData: previousData,
    timestamp: new Date(),
  };

  await DeliveryPointHistory.create(historyData);
});

module.exports = DeliveryPoint;

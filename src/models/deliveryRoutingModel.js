const { Sequelize } = require("../utils/npmPackages");
const { DataTypes } = Sequelize;
const sequelize = require("../config/database");
const DeliveryRoutingHistory = require("./deliveryRoutingHistoryModel");

const DeliveryRouting = sequelize.define(
  "DeliveryRouting",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    deliveryWorkerId: {
      type: DataTypes.UUID,
    },
    date: {
      type: DataTypes.DATE,
    },
    ordersQuantity: {
      type: DataTypes.INTEGER, // should be calculated
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

DeliveryRouting.addScope("active", {
  // check if this scope is required or it is done by default
  where: {
    deletedAt: null,
  },
});

DeliveryRouting.addHook("beforeFind", (options) => {
  const DeliveryWorker = require("./deliveryWorkerModel");
  options.include = [
    {
      model: DeliveryWorker,
      as: "deliveryWorkerFk",
      attributes: ["id", "name", "mobileNumber"],
    },
  ];
  return options;
});

DeliveryRouting.addHook("beforeUpdate", async (deliveryRouting, options) => {
  const changedAttributes = deliveryRouting.changed();
  const previousData = deliveryRouting.previous();
  let historyData;
  // in case of soft delete
  if (changedAttributes.includes("deletedAt")) {
    historyData = {
      deliveryRoutingId: deliveryRouting.id,
      action: "delete",
      previousData: previousData,
      timestamp: new Date(),
    };
  } else {
    // in case of update
    historyData = {
      deliveryRoutingId: deliveryRouting.id,
      action: "update",
      changes: changedAttributes,
      previousData: previousData,
      timestamp: new Date(),
    };
  }
  await DeliveryRoutingHistory.create(historyData);
});

DeliveryRouting.addHook("beforeDestroy", async (deliveryRouting, options) => {
  const previousData = deliveryRouting.previous();

  const historyData = {
    deliveryRoutingId: deliveryRouting.id,
    action: "delete",
    previousData: previousData,
    timestamp: new Date(),
  };

  await DeliveryRoutingHistory.create(historyData);
});

module.exports = DeliveryRouting;

const { Sequelize } = require("../utils/npmPackages");
const { DataTypes } = Sequelize;
const sequelize = require("../config/database");
const DeliveryTypeHistory = require("./deliveryTypeHistoryModel");

const DeliveryType = sequelize.define(
  "DeliveryType",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    type: {
      type: DataTypes.STRING,
      required: true,
      unique: true,
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

DeliveryType.addScope("active", {
  // check if this scope is required or it is done by default
  where: {
    deletedAt: null,
  },
});

DeliveryType.addHook("beforeUpdate", async (deliveryType, options) => {
  const changedAttributes = deliveryType.changed();
  const previousData = deliveryType.previous();
  let historyData;
  // in case of soft delete
  if (changedAttributes.includes("deletedAt")) {
    historyData = {
      deliveryTypeId: deliveryType.id,
      action: "delete",
      previousData: previousData,
      timestamp: new Date(),
    };
  } else {
    // in case of update
    historyData = {
      deliveryTypeId: deliveryType.id,
      action: "update",
      changes: changedAttributes,
      previousData: previousData,
      timestamp: new Date(),
    };
  }
  await DeliveryTypeHistory.create(historyData);
});

DeliveryType.addHook("beforeDestroy", async (deliveryType, options) => {
  const previousData = deliveryType.previous();

  const historyData = {
    deliveryTypeId: deliveryType.id,
    action: "delete",
    previousData: previousData,
    timestamp: new Date(),
  };

  await DeliveryTypeHistory.create(historyData);
});

module.exports = DeliveryType;

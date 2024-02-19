const { Sequelize } = require("../utils/npmPackages");
const { DataTypes } = Sequelize;
const sequelize = require("../config/database");
const ServiceOptionHistory = require("./serviceOptionHistoryModel");

const ServiceOption = sequelize.define(
  "ServiceOption",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    option: {
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

ServiceOption.addScope("active", {
  // check if this scope is required or it is done by default
  where: {
    deletedAt: null,
  },
});

ServiceOption.addHook("beforeUpdate", async (serviceOption, options) => {
  const changedAttributes = serviceOption.changed();
  const previousData = serviceOption.previous();
  let historyData;
  // in case of soft delete
  if (changedAttributes.includes("deletedAt")) {
    historyData = {
      serviceOptionId: serviceOption.id,
      action: "delete",
      previousData: previousData,
      timestamp: new Date(),
    };
  } else {
    // in case of update
    historyData = {
      serviceOptionId: serviceOption.id,
      action: "update",
      changes: changedAttributes,
      previousData: previousData,
      timestamp: new Date(),
    };
  }
  await ServiceOptionHistory.create(historyData);
});

ServiceOption.addHook("beforeDestroy", async (serviceOption, options) => {
  const previousData = serviceOption.previous();

  const historyData = {
    serviceOptionId: serviceOption.id,
    action: "delete",
    previousData: previousData,
    timestamp: new Date(),
  };

  await ServiceOptionHistory.create(historyData);
});

module.exports = ServiceOption;

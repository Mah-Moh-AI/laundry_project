const { Sequelize } = require("../utils/npmPackages");
const { DataTypes } = Sequelize;
const sequelize = require("../config/database");
const ServicePreferenceHistory = require("./servicePreferenceHistoryModel");

const ServicePreference = sequelize.define(
  "ServicePreference",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    preference: {
      type: DataTypes.STRING,
      required: true,
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

ServicePreference.addScope("active", {
  // check if this scope is required or it is done by default
  where: {
    deletedAt: null,
  },
});

ServicePreference.addHook(
  "beforeUpdate",
  async (servicePreference, options) => {
    const changedAttributes = servicePreference.changed();
    const previousData = servicePreference.previous();
    let historyData;
    // in case of soft delete
    if (changedAttributes.includes("deletedAt")) {
      historyData = {
        servicePreferenceId: servicePreference.id,
        action: "delete",
        previousData: previousData,
        timestamp: new Date(),
      };
    } else {
      // in case of update
      historyData = {
        servicePreferenceId: servicePreference.id,
        action: "update",
        changes: changedAttributes,
        previousData: previousData,
        timestamp: new Date(),
      };
    }
    await ServicePreferenceHistory.create(historyData);
  }
);

ServicePreference.addHook(
  "beforeDestroy",
  async (servicePreference, options) => {
    const previousData = servicePreference.previous();

    const historyData = {
      servicePreferenceId: servicePreference.id,
      action: "delete",
      previousData: previousData,
      timestamp: new Date(),
    };

    await ServicePreferenceHistory.create(historyData);
  }
);

module.exports = ServicePreference;

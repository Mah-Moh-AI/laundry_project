const { Sequelize } = require("../utils/npmPackages");
const { DataTypes } = Sequelize;
const sequelize = require("../config/database");
const LocationHistory = require("./locationHistoryModel");
const Client = require("./clientModel");

const Location = sequelize.define(
  "Location",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    clientId: {
      type: DataTypes.UUID,
    },
    locationPoint: {
      type: DataTypes.GEOMETRY("POINT"),
      allowNull: false,
    },
    postalCode: DataTypes.STRING,
    street: DataTypes.STRING,
    district: DataTypes.STRING,
    city: DataTypes.STRING,
    state: DataTypes.STRING,
  },
  {
    timestamps: true,
    createdAt: "createdAt",
    updatedAt: "lastUpdatedAt",
    deletedAt: "deletedAt",
    paranoid: true, // for soft delete
    hooks: {
      // All hooks are added below
    },
    indexes: [
      {
        name: "index_location",
        fields: ["locationPoint"],
      },
    ],
  }
);

Location.addScope("active", {
  // check if this scope is required or it is done by default
  where: {
    deletedAt: null,
  },
});

Location.addHook("beforeUpdate", async (location, options) => {
  const changedAttributes = location.changed();
  const previousData = location.previous();
  let historyData;
  // in case of soft delete
  if (changedAttributes.includes("deletedAt")) {
    historyData = {
      locationId: location.id,
      action: "delete",
      previousData: previousData,
      timestamp: new Date(),
    };
  } else {
    // in case of update
    historyData = {
      locationId: location.id,
      action: "update",
      changes: changedAttributes,
      previousData: previousData,
      timestamp: new Date(),
    };
  }
  await LocationHistory.create(historyData);
});

Location.addHook("beforeDestroy", async (location, options) => {
  const previousData = location.previous();

  const historyData = {
    locationId: location.id,
    action: "delete",
    previousData: previousData,
    timestamp: new Date(),
  };

  await LocationHistory.create(historyData);
});

module.exports = Location;

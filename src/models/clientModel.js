const { Sequelize } = require("../utils/npmPackages");
const { DataTypes } = Sequelize;
const sequelize = require("../config/database");
const ClientHistory = require("./clientHistoryModel");
const User = require("./userModel");

const Client = sequelize.define(
  "Client",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
    },
    lastLocation: {
      type: DataTypes.UUID,
    },
    successfulOrders: {
      type: DataTypes.INTEGER, // shall be updated based on order issuance trigger
      defaultValue: 0,
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

Client.addScope("active", {
  where: {
    deletedAt: null,
  },
});

Client.addHook("beforeUpdate", async (client, options) => {
  const changedAttributes = client.changed();
  const previousData = client.previous();
  let historyData;
  // in case of soft delete
  if (changedAttributes.includes("deletedAt")) {
    historyData = {
      clientId: client.id,
      action: "delete",
      previousData: previousData,
      timestamp: new Date(),
    };
  } else {
    // in case of update
    historyData = {
      clientId: client.id,
      action: "update",
      changes: changedAttributes,
      previousData: previousData,
      timestamp: new Date(),
    };
  }
  await ClientHistory.create(historyData);
});

Client.addHook("beforeDestroy", async (client, options) => {
  const previousData = client.previous();

  const historyData = {
    clientId: client.id,
    action: "delete",
    previousData: previousData,
    timestamp: new Date(),
  };

  await ClientHistory.create(historyData);
});

Client.addHook("beforeFind", function (options) {
  console.log("Applied Scopes:", options.attributes, options.include);
  options.include = [
    {
      model: User,
      as: "clientIdFk",
      attributes: ["id", "name"],
    },
  ];
  return options;
});

module.exports = Client;

const { Sequelize } = require("../utils/npmPackages");
const { DataTypes } = Sequelize;
const sequelize = require("../config/database");
const ClothesTypeHistory = require("./clothesTypeHistoryModel");

const ClothesType = sequelize.define(
  "ClothesType",
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

ClothesType.addScope("active", {
  // check if this scope is required or it is done by default
  where: {
    deletedAt: null,
  },
});

ClothesType.addHook("beforeUpdate", async (clothesType, options) => {
  const changedAttributes = clothesType.changed();
  const previousData = clothesType.previous();
  let historyData;
  // in case of soft delete
  if (changedAttributes.includes("deletedAt")) {
    historyData = {
      clothesTypeId: clothesType.id,
      action: "delete",
      previousData: previousData,
      timestamp: new Date(),
    };
  } else {
    // in case of update
    historyData = {
      clothesTypeId: clothesType.id,
      action: "update",
      changes: changedAttributes,
      previousData: previousData,
      timestamp: new Date(),
    };
  }
  await ClothesTypeHistory.create(historyData);
});

ClothesType.addHook("beforeDestroy", async (clothesType, options) => {
  const previousData = clothesType.previous();

  const historyData = {
    clothesTypeId: clothesType.id,
    action: "delete",
    previousData: previousData,
    timestamp: new Date(),
  };

  await ClothesTypeHistory.create(historyData);
});

module.exports = ClothesType;

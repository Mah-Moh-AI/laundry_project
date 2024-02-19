const { Sequelize, bcrypt } = require("../utils/npmPackages");
const { DataTypes } = Sequelize;
const sequelize = require("../config/database");
const BranchHistory = require("./branchHistroyModel");

const Branch = sequelize.define(
  "Branch",
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
      unique: true,
    },
    location: {
      type: DataTypes.GEOMETRY("POINT"),
      allowNull: false,
    },
    buildingNumber: DataTypes.STRING,
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
        unique: true,
        fields: ["name"],
      },
      {
        name: "index_location",
        fields: ["location"],
      },
    ],
  }
);

Branch.addScope("active", {
  where: {
    deletedAt: null,
  },
});

Branch.addHook("beforeUpdate", async (branch, options) => {
  const changedAttributes = branch.changed();
  const previousData = branch.previous();
  let historyData;
  // in case of soft delete
  if (changedAttributes.includes("deletedAt")) {
    historyData = {
      branchId: branch.id,
      action: "delete",
      previousData: previousData,
      timestamp: new Date(),
    };
  } else {
    // in case of update
    historyData = {
      branchId: branch.id,
      action: "update",
      changes: changedAttributes,
      previousData: previousData,
      timestamp: new Date(),
    };
  }
  await BranchHistory.create(historyData);
});

Branch.addHook("beforeDestroy", async (branch, options) => {
  const previousData = branch.previous();

  const historyData = {
    branchId: branch.id,
    action: "delete",
    previousData: previousData,
    timestamp: new Date(),
  };

  await BranchHistory.create(historyData);
});

module.exports = Branch;

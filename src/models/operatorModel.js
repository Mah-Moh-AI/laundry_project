const { Sequelize } = require("../utils/npmPackages");
const { DataTypes } = Sequelize;
const sequelize = require("../config/database");
const OperatorHistory = require("./operatorHistoryModel");
const logger = require("../logging/index");

const Operator = sequelize.define(
  "Operator",
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
    ordersInHand: {
      type: DataTypes.INTEGER, // shall be updated based on order assignment trigger
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

Operator.addScope("active", {
  // check if this scope is required or it is done by default
  where: {
    deletedAt: null,
  },
});

Operator.addHook("beforeUpdate", async (operator, options) => {
  const changedAttributes = operator.changed();
  const previousData = operator.previous();
  let historyData;
  // in case of soft delete
  if (changedAttributes.includes("deletedAt")) {
    historyData = {
      operatorId: operator.id,
      action: "delete",
      previousData: previousData,
      timestamp: new Date(),
    };
  } else {
    // in case of update
    historyData = {
      operatorId: operator.id,
      action: "update",
      changes: changedAttributes,
      previousData: previousData,
      timestamp: new Date(),
    };
  }
  await OperatorHistory.create(historyData);
});

Operator.addHook("beforeDestroy", async (operator, options) => {
  const previousData = operator.previous();

  const historyData = {
    operatorId: operator.id,
    action: "delete",
    previousData: previousData,
    timestamp: new Date(),
  };

  await OperatorHistory.create(historyData);
});

Operator.sync({ force: false, alter: false })
  .then(() => {
    logger.info("Operator table created (if not exists) successfully");
  })
  .catch((error) => {
    logger.error("Error creating Operator table:", error);
    return new AppError("Error creating Operator table", 500);
  });

module.exports = Operator;

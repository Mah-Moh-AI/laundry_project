const { Sequelize } = require("../utils/npmPackages");
const { DataTypes } = Sequelize;
const sequelize = require("../config/database");
const InvoiceItemHistory = require("./invoiceItemHistoryModel");

const InvoiceItem = sequelize.define(
  "InvoiceItem",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    invoiceId: {
      type: DataTypes.UUID,
    },
    serviceId: {
      type: DataTypes.UUID,
    },
    orderId: {
      type: DataTypes.UUID,
    },
    itemQuantity: {
      type: DataTypes.INTEGER, // to be calculated
    },
    itemPrice: {
      type: DataTypes.FLOAT, // to be calculated
    },
    itemTotalPrice: {
      type: DataTypes.FLOAT, // to be calculated
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

InvoiceItem.addScope("active", {
  // check if this scope is required or it is done by default
  where: {
    deletedAt: null,
  },
});

InvoiceItem.addHook("beforeUpdate", async (invoiceItem, options) => {
  const changedAttributes = invoiceItem.changed();
  const previousData = invoiceItem.previous();
  let historyData;
  // in case of soft delete
  if (changedAttributes.includes("deletedAt")) {
    historyData = {
      invoiceItemId: invoiceItem.id,
      action: "delete",
      previousData: previousData,
      timestamp: new Date(),
    };
  } else {
    // in case of update
    historyData = {
      invoiceItemId: invoiceItem.id,
      action: "update",
      changes: changedAttributes,
      previousData: previousData,
      timestamp: new Date(),
    };
  }
  await InvoiceItemHistory.create(historyData);
});

InvoiceItem.addHook("beforeDestroy", async (invoiceItem, options) => {
  const previousData = invoiceItem.previous();

  const historyData = {
    invoiceItemId: invoiceItem.id,
    action: "delete",
    previousData: previousData,
    timestamp: new Date(),
  };

  await InvoiceItemHistory.create(historyData);
});

module.exports = InvoiceItem;

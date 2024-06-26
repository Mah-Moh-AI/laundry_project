const { Sequelize } = require("../utils/npmPackages");
const { DataTypes } = Sequelize;
const sequelize = require("../config/database");
const InvoiceHistory = require("./invoiceHistoryModel");

const Invoice = sequelize.define(
  "Invoice",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    invoiceNumber: {
      type: DataTypes.INTEGER, // should be Autogenerated
      allowNull: false,
    },
    date: {
      type: DataTypes.DATE,
      defaultValue: new Date(),
    },
    clientId: {
      type: DataTypes.UUID,
    },
    orderId: {
      type: DataTypes.UUID,
    },
    InvoiceTotalPrice: {
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

Invoice.addScope("active", {
  // check if this scope is required or it is done by default
  where: {
    deletedAt: null,
  },
});

Invoice.addHook("beforeUpdate", async (invoice, options) => {
  const changedAttributes = invoice.changed();
  const previousData = invoice.previous();
  let historyData;
  // in case of soft delete
  if (changedAttributes.includes("deletedAt")) {
    historyData = {
      invoiceId: invoice.id,
      action: "delete",
      previousData: previousData,
      timestamp: new Date(),
    };
  } else {
    // in case of update
    historyData = {
      invoiceId: invoice.id,
      action: "update",
      changes: changedAttributes,
      previousData: previousData,
      timestamp: new Date(),
    };
  }
  await InvoiceHistory.create(historyData);
});

Invoice.addHook("beforeDestroy", async (invoice, options) => {
  const previousData = invoice.previous();

  const historyData = {
    invoiceId: invoice.id,
    action: "delete",
    previousData: previousData,
    timestamp: new Date(),
  };

  await InvoiceHistory.create(historyData);
});

module.exports = Invoice;

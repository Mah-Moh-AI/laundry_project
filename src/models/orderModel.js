const { Sequelize } = require("../utils/npmPackages");
const { DataTypes } = Sequelize;
const sequelize = require("../config/database");
const OrderHistory = require("./orderHistoryModel");
const Client = require("./clientModel");
const DeliveryOption = require("./deliveryTypeModel");
const Operator = require("./operatorModel");
const Location = require("./locationModel");
const DeliveryType = require("./deliveryTypeModel");

const Order = sequelize.define(
  "Order",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    totalPrice: DataTypes.FLOAT,
    clientId: {
      type: DataTypes.UUID,
    },
    locationId: {
      type: DataTypes.UUID,
    },
    orderTime: {
      type: DataTypes.DATE,
      defaultValue: new Date(),
    },
    deliveryTypeId: {
      type: DataTypes.UUID,
    },
    deliveryDate: {
      type: DataTypes.DATE, // to be calculated based on delivery type
    },
    operatorId: {
      type: DataTypes.UUID,
    },
    itemsQuantity: {
      type: DataTypes.INTEGER, // to be calculated
    },
    status: {
      type: DataTypes.STRING, // to be calculated
      validate: {
        isIn: {
          args: [
            [
              "recieved",
              "arrived laundry",
              "washing",
              "ironing",
              "ready for delivery",
              "in its way",
              "delivered",
            ],
          ],
          msg: "Invalid status",
        },
      },
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

Order.addScope("active", {
  // check if this scope is required or it is done by default
  where: {
    deletedAt: null,
  },
});

Order.addHook("beforeUpdate", async (order, options) => {
  const changedAttributes = order.changed();
  const previousData = order.previous();
  let historyData;
  // in case of soft delete
  if (changedAttributes.includes("deletedAt")) {
    historyData = {
      orderId: order.id,
      action: "delete",
      previousData: previousData,
      timestamp: new Date(),
    };
  } else {
    // in case of update
    historyData = {
      orderId: order.id,
      action: "update",
      changes: changedAttributes,
      previousData: previousData,
      timestamp: new Date(),
    };
  }
  await OrderHistory.create(historyData);
});

Order.addHook("beforeDestroy", async (order, options) => {
  const previousData = order.previous();

  const historyData = {
    orderId: order.id,
    action: "delete",
    previousData: previousData,
    timestamp: new Date(),
  };

  await OrderHistory.create(historyData);
});

Order.addHook("beforeFind", function (options) {
  const ClientModel = require("./clientModel");
  options.include = [
    {
      model: Location,
      as: "locationFk",
      attributes: ["id", "locationPoint"],
    },
    {
      model: Client,
      as: "clientFk",
      // attributes: ["id", ""],
    },
    {
      model: DeliveryType,
      as: "deliveryTypeFk",
      // attributes: ["id", ""],
    },
    {
      model: Operator,
      as: "operatorFk",
      // attributes: ["id", ""],
    },
  ];
  console.log("Applied Scopes:", options.attributes, options.include);
  return options;
});

module.exports = Order;

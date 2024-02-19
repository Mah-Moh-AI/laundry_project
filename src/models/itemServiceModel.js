const { Sequelize } = require("../utils/npmPackages");
const { DataTypes } = Sequelize;
const sequelize = require("../config/database");
const ItemServiceHistory = require("./itemServiceHistoryModel");
const Order = require("./orderModel");
const Service = require("./serviceModel");
const ServicePreference = require("./servicePreferenceModel");
const ClothesType = require("./clothesTypeModel");
const ServiceOption = require("./serviceOptionModel");
const DeliveryType = require("./deliveryTypeModel");

const ItemService = sequelize.define(
  "ItemService",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    orderId: {
      type: DataTypes.UUID,
    },
    serviceId: {
      type: DataTypes.UUID,
    },
    quantity: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
    status: {
      type: DataTypes.STRING,
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

ItemService.addScope("active", {
  // check if this scope is required or it is done by default
  where: {
    deletedAt: null,
  },
});

ItemService.addHook("beforeFind", function (options) {
  options.include = [
    {
      model: Order,
      as: "orderFk",
      attributes: ["id"],
    },
    {
      model: Service,
      as: "serviceFk",
      attributes: [
        "id",
        "clothesTypeId",
        "servicePreferenceId",
        "serviceOptionId",
        "servicePrice",
        "deliveryTypeId",
      ],
      include: [
        {
          model: ServicePreference,
          as: "servicePreferenceFk",
          attributes: ["id", "preference"],
        },
        {
          model: ClothesType,
          as: "clothesTypeFk",
          attributes: ["id", "type"],
        },
        {
          model: ServiceOption,
          as: "serviceOptionFk",
          attributes: ["id", "option"],
        },
        {
          model: DeliveryType,
          as: "deliveryTypeServiceFk",
          attributes: ["id", "type"],
        },
      ],
    },
  ];
  console.log("Applied Scopes:", options.attributes, options.include);
  return options;
});

ItemService.addHook("beforeUpdate", async (itemService, options) => {
  const changedAttributes = itemService.changed();
  const previousData = itemService.previous();
  let historyData;
  // in case of soft delete
  if (changedAttributes.includes("deletedAt")) {
    historyData = {
      itemServiceId: itemService.id,
      action: "delete",
      previousData: previousData,
      timestamp: new Date(),
    };
  } else {
    // in case of update
    historyData = {
      itemServiceId: itemService.id,
      action: "update",
      changes: changedAttributes,
      previousData: previousData,
      timestamp: new Date(),
    };
  }
  await ItemServiceHistory.create(historyData);
});

ItemService.addHook("beforeDestroy", async (itemService, options) => {
  const previousData = itemService.previous();

  const historyData = {
    itemServiceId: itemService.id,
    action: "delete",
    previousData: previousData,
    timestamp: new Date(),
  };

  await ItemServiceHistory.create(historyData);
});

module.exports = ItemService;

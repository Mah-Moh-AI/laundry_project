const { Sequelize } = require("../utils/npmPackages");
const { DataTypes } = Sequelize;
const sequelize = require("../config/database");
const ServiceHistory = require("./serviceHistoryModel");
const ClothesType = require("./clothesTypeModel");
const ServicePreference = require("./servicePreferenceModel");
const ServiceOption = require("./serviceOptionModel");
const DeliveryType = require("./deliveryTypeModel");

const Service = sequelize.define(
  "Service",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    clothesTypeId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    servicePreferenceId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    serviceOptionId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    deliveryTypeId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    servicePrice: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    createdAt: "createdAt",
    updatedAt: "lastUpdatedAt",
    deletedAt: "deletedAt",
    paranoid: true, // for soft delete
    indexes: [
      {
        unique: true,
        fields: ["clothesTypeId", "servicePreferenceId", "serviceOptionId"],
      },
    ],
  }
);

Service.addScope("active", {
  // check if this scope is required or it is done by default
  where: {
    deletedAt: null,
  },
});

Service.addHook("beforeFind", function (options) {
  options.include = [
    {
      model: ClothesType,
      as: "clothesTypeFk",
      attributes: ["id", "type"],
    },
    {
      model: ServicePreference,
      as: "servicePreferenceFk",
      attributes: ["id", "preference"],
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
  ];
  console.log("Applied Scopes:", options.attributes, options.include);
  return options;
});

Service.addHook("beforeUpdate", async (service, options) => {
  const changedAttributes = service.changed();
  const previousData = service.previous();
  let historyData;
  // in case of soft delete
  if (changedAttributes.includes("deletedAt")) {
    historyData = {
      serviceId: service.id,
      action: "delete",
      previousData: previousData,
      timestamp: new Date(),
    };
  } else {
    // in case of update
    historyData = {
      serviceId: service.id,
      action: "update",
      changes: changedAttributes,
      previousData: previousData,
      timestamp: new Date(),
    };
  }
  await ServiceHistory.create(historyData);
});

Service.addHook("beforeDestroy", async (service, options) => {
  const previousData = service.previous();

  const historyData = {
    serviceId: service.id,
    action: "delete",
    previousData: previousData,
    timestamp: new Date(),
  };

  await ServiceHistory.create(historyData);
});

module.exports = Service;

const Client = require("../clientModel");
const User = require("../userModel");
const Branch = require("../branchModel");
const Operator = require("../operatorModel");
const Service = require("../serviceModel");
const ClothesType = require("../clothesTypeModel");
const ServiceOption = require("../serviceOptionModel");
const ServicePreference = require("../servicePreferenceModel");
const ItemService = require("../itemServiceModel");
const Order = require("../orderModel");
const Location = require("../locationModel");
const DeliveryType = require("../deliveryTypeModel");
const DeliveryRouting = require("../deliveryRoutingModel");
const DeliveryPoint = require("../deliveryPointModel");
const DeliveryWorker = require("../deliveryWorkerModel");
const Invoice = require("../invoiceModel");
const InvoiceItem = require("../invoiceItemModel");

Client.belongsTo(User, { foreignKey: "userId", as: "clientIdFk" });
User.hasOne(Client, { foreignKey: "userId", as: "clientIdFk" });

Operator.belongsTo(User, { foreignKey: "userId", as: "operatorIdFk" });
User.hasOne(Operator, { foreignKey: "userId", as: "operatorIdFk" });

User.belongsTo(Branch, { foreignKey: "branch", as: "branchIdFk" });
Branch.hasMany(User, { foreignKey: "branch", as: "branchIdFk" });

Service.belongsTo(ClothesType, {
  foreignKey: "clothesTypeId",
  as: "clothesTypeFk",
});
ClothesType.hasMany(Service, {
  foreignKey: "clothesTypeId",
  as: "clothesTypeFk",
});

Service.belongsTo(ServiceOption, {
  foreignKey: "serviceOptionId",
  as: "serviceOptionFk",
});
ServiceOption.hasMany(Service, {
  foreignKey: "serviceOptionId",
  as: "serviceOptionFk",
});

Service.belongsTo(ServicePreference, {
  foreignKey: "servicePreferenceId",
  as: "servicePreferenceFk",
});
ServicePreference.hasMany(Service, {
  foreignKey: "servicePreferenceId",
  as: "servicePreferenceFk",
});

Service.belongsTo(DeliveryType, {
  foreignKey: "deliveryTypeId",
  as: "deliveryTypeServiceFk",
});
DeliveryType.hasMany(Service, {
  foreignKey: "deliveryTypeId",
  as: "deliveryTypeServiceFk",
});

ItemService.belongsTo(Order, {
  foreignKey: "orderId",
  as: "orderFk",
});
Order.hasMany(ItemService, {
  foreignKey: "orderId",
  as: "orderFk",
});

ItemService.belongsTo(Service, {
  foreignKey: "serviceId",
  as: "serviceFk",
});
Service.hasMany(ItemService, {
  foreignKey: "serviceId",
  as: "serviceFk",
});

Order.belongsTo(Client, {
  foreignKey: "clientId",
  as: "clientFk",
});
Client.hasMany(Order, {
  foreignKey: "clientId",
  as: "clientFk",
});

Order.belongsTo(Location, {
  foreignKey: "locationId",
  as: "locationFk",
});
Location.hasMany(Order, {
  foreignKey: "locationId",
  as: "locationFk",
});

Order.belongsTo(DeliveryType, {
  foreignKey: "deliveryTypeId",
  as: "deliveryTypeFk",
});
DeliveryType.hasMany(Order, {
  foreignKey: "deliveryTypeId",
  as: "deliveryTypeFk",
});

Order.belongsTo(Operator, {
  foreignKey: "operatorId",
  as: "operatorFk",
});
Operator.hasMany(Order, {
  foreignKey: "operatorId",
  as: "operatorFk",
});

Location.belongsTo(Client, {
  foreignKey: "clientId",
  as: "location-clientFk",
});
Client.hasMany(Location, {
  foreignKey: "clientId",
  as: "location-clientFk",
});

DeliveryRouting.belongsTo(DeliveryWorker, {
  foreignKey: "deliveryWorkerId",
  as: "deliveryWorkerFk",
});
DeliveryWorker.hasMany(DeliveryRouting, {
  foreignKey: "deliveryWorkerId",
  as: "deliveryWorkerFk",
});

DeliveryPoint.belongsTo(DeliveryRouting, {
  foreignKey: "deliveryRouteId",
  as: "deliveryRouteFk",
});
DeliveryRouting.hasMany(DeliveryPoint, {
  foreignKey: "deliveryRouteId",
  as: "deliveryRouteFk",
});

Invoice.belongsTo(Client, {
  foreignKey: "clientId",
  as: "invoice-clientFk",
});
Client.hasMany(Invoice, {
  foreignKey: "clientId",
  as: "invoice-clientFk",
});

Invoice.belongsTo(Order, {
  foreignKey: "orderId",
  as: "invoice-orderFk",
});
Order.hasOne(Invoice, {
  foreignKey: "orderId",
  as: "invoice-orderFk",
});

InvoiceItem.belongsTo(Invoice, {
  foreignKey: "invoiceId",
  as: "invoiceItem-invoiceFk",
});
Invoice.hasMany(InvoiceItem, {
  foreignKey: "invoiceId",
  as: "invoiceItem-invoiceFk",
});

InvoiceItem.belongsTo(Service, {
  foreignKey: "serviceId",
  as: "invoiceItem-serviceFk",
});
Service.hasMany(InvoiceItem, {
  foreignKey: "serviceId",
  as: "invoiceItem-serviceFk",
});

InvoiceItem.belongsTo(Order, {
  foreignKey: "orderId",
  as: "invoiceItem-orderFk",
});
Order.hasOne(InvoiceItem, {
  foreignKey: "orderId",
  as: "invoiceItem-orderFk",
});

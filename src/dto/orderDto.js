class OrderDto {
  constructor(order) {
    this.id = order.id;
    this.totalPrice = order.totalPrice;
    this.locationId = order.locationId;
    this.orderTime = order.orderTime;
    this.deliveryTypeId = order.deliveryTypeId;
    this.deliveryDate = order.deliveryDate;
    this.operatorId = order.operatorId;
    this.itemsQuantity = order.itemsQuantity;
    this.status = order.status;
  }
}

module.exports = OrderDto;

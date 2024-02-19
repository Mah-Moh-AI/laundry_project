class DeliveryRoutingDto {
  constructor(deliveryRouting) {
    this.id = deliveryRouting.id;
    this.deliveryWorkerId = deliveryRouting.deliveryWorkerId;
    this.date = deliveryRouting.date;
    this.ordersQuantity = deliveryRouting.ordersQuantity;
  }
}

module.exports = DeliveryRoutingDto;

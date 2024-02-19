class DeliveryPointDto {
  constructor(deliveryPoint) {
    this.id = deliveryPoint.id;
    this.deliveryRouteId = deliveryPoint.deliveryRouteId;
    this.orderId = deliveryPoint.orderId;
    this.sequenceNumber = deliveryPoint.sequenceNumber;
  }
}

module.exports = DeliveryPointDto;

class ItemServiceDto {
  constructor(itemService) {
    this.id = itemService.id;
    this.orderId = itemService.orderId;
    this.serviceId = itemService.serviceId;
    this.quantity = itemService.quantity;
    this.status = itemService.status;
  }
}

module.exports = ItemServiceDto;

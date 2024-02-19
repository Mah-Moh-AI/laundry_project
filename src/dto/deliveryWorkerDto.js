class DeliveryWorkerDto {
  constructor(deliveryWorker) {
    this.id = deliveryWorker.id;
    this.name = deliveryWorker.name;
    this.mobileNumber = deliveryWorker.mobileNumber;
  }
}

module.exports = DeliveryWorkerDto;

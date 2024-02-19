class ServiceDto {
  constructor(service) {
    this.id = service.id;
    this.clothesTypeId = service.clothesTypeId;
    this.clothesTypeFk = service.clothesTypeFk;
    this.servicePreferenceId = service.servicePreferenceId;
    this.servicePreferenceFk = service.servicePreferenceFk;
    this.serviceOptionId = service.serviceOptionId;
    this.serviceOptionFk = service.serviceOptionFk;
    this.servicePrice = service.servicePrice;
    this.deliveryTypeId = service.deliveryTypeId;
    this.deliveryTypeServiceFk = service.deliveryTypeServiceFk;
  }
}

module.exports = ServiceDto;

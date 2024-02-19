class LocationDto {
  constructor(location) {
    this.id = location.id;
    this.clientId = location.clientId;
    this.locationPoint = location.locationPoint;
    this.apartmentNumber = location.apartmentNumber;
    this.buildingNumber = location.type;
    this.postalCode = location.postalCode;
    this.street = location.street;
    this.district = location.district;
    this.city = location.city;
    this.state = location.state;
  }
}

module.exports = LocationDto;

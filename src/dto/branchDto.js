class branchDto {
  constructor(doc) {
    this.id = doc.id;
    this.name = doc.name;
    this.location = doc.location;
    this.buildingNumber = doc.buildingNumber;
    this.postalCode = doc.postalCode;
    this.street = doc.street;
    this.district = doc.district;
    this.city = doc.city;
    this.state = doc.state;
  }
}

module.exports = branchDto;

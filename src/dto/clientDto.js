class ClientDto {
  constructor(client) {
    this.id = client.id;
    this.userId = client.userId;
    this.lastLocation = client.lastLocation;
    this.successfulOrders = client.successfulOrders;
    this.clientIdFk = client.clientIdFk;
  }
}

module.exports = ClientDto;

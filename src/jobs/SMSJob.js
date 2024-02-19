const { accountSid, authToken, MobileNumber } = require("../config/env");
const { twilio } = require("../utils/npmPackages");
const client = twilio(accountSid, authToken);

module.exports = class SMS {
  constructor(mobileNumber) {
    this.mobileNumber = `+2${mobileNumber}`;
  }
  // create message and send it.
  async newMessage(messageBody) {
    const message = await client.messages.create({
      body: messageBody,
      from: MobileNumber,
      to: this.mobileNumber,
    });
    return message.sid;
  }

  // send Mobile verification message
  async sendVerifyMobile(mobileVerificationNumber) {
    const message = await this.newMessage(
      `This is your verification Number ${mobileVerificationNumber}`
    );
    return message;
  }

  // send reset url message
  async sendResetUrl(resetUrl) {
    const message = await this.newMessage(`This is your reset url ${resetUrl}`);
    return message;
  }

  // send Delivery Route Front End url Message
  async sendDeliveryRouteMessage(deliveryRouteId) {
    const message = await this.newMessage(
      `Open the delivery route url www.test.com/delivery/route/${deliveryRouteId}`
    );
    return message;
  }
};

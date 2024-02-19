const env = require("../config/env");
const npmPackages = require("../utils/npmPackages");
const { nodemailer } = npmPackages;

module.exports = class Email {
  constructor(user, url, to) {
    if (!to) {
      this.to = user.email;
    } else {
      this.to = to;
      this.email = user.email;
    }
    this.firstName = user.name.split(" ")[0];
    this.url = url;
    this.from = `Galelio <${env.EMAIL_FROM}>`;
  }

  newTransport() {
    if (env.NODE_ENV === "production") {
      // Sendgrid
      // mailsaic is used for testing purpose

      return nodemailer.createTransport({
        service: "SendGrid",
        auth: {
          user: env.SENDGRID_USERNAME,
          pass: env.SENDGRID_PASSWORD,
        },
      });
    }
    // mailtrap is used for testing purpose
    return nodemailer.createTransport({
      host: env.EMAIL_HOST,
      port: env.EMAIL_PORT,
      auth: {
        user: env.EMAIL_USERNAME,
        pass: env.EMAIL_PASSWORD,
      },
    });
  }

  // Send the actual email
  async send(subject, messageBody) {
    // 1) Define email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      text: messageBody,
    };

    // 2) Create a transport and send email
    await this.newTransport().sendMail(mailOptions);
  }

  async sendConfirmEmail() {
    await this.send(
      "Welcome (Your email is verified)",
      "Your email is verified. Welcome to the application!"
    );
  }

  async sendPasswordReset() {
    await this.send(
      "Your password reset token (valid for only 15 minutes)",
      `Hi ${this.firstName},\nForgot your password? Submit your new password and passwordConfirm to: ${this.url}.\nIf you didn't forget your password, please ignore this email!`
    );
  }

  async sendVerificationUrl() {
    await this.send(
      "This is your verfication link",
      `Hi ${this.firstName},\nWelcome to our Application. Please click on the next link to verify your email: ${this.url}.\nIf you are not registered in this application, please ignore this email!`
    );
  }

  async sendSuccessfulRegisterNotification() {
    await this.send(
      `Welcome to Company ${this.company}`,
      `Hi ${this.firstName},\nWelcome to ${this.company}. Your registeration is completed successfully`
    );
  }

  async sendSuccessfulRegisterNotificationToAdmin() {
    // missing: the email is sent to employee not Admin
    await this.send(
      `SuccessfulRegisteration Notification for Employee: ${this.firstName}`,
      `Hi ${this.companyAdminName},\n ${this.firstName} with email: ${this.email} registeration is completed successfully`
    );
  }
};

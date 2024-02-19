const AppError = require("../utils/appError");
const logger = require("../logging/index");
const APIFeatures = require("../utils/apiFeatures");
const userRepository = require("../repositories/userRepository");
const Email = require("../jobs/emailJob");
const UserDto = require("../dto/userDto");
const npmPackages = require("../utils/npmPackages");
const { crypto } = npmPackages;

class emailVerficaitionService {
  async sendVerificationUrlEmail(id, verificationUrl) {
    // 1) get user by id
    const user = await userRepository.getUser(id);

    // 2) check if user exists
    if (!user) {
      throw new AppError("This user do not exist. Something went wrong", 400);
    }

    // 3) check if email exists
    if (!user.email) {
      throw new AppError(
        "This email is not registered for this user. Something went wrong",
        400
      );
    }
    // 4) check email is not verified
    if (user.emailVerified) {
      throw new AppError("This email is already verified for this user.", 400);
    }

    // 5) create verification token
    const verificatioToken = await user.createVerificationToken();

    // 5) create URL
    const url = `${verificationUrl}${verificatioToken}`;

    // 6) create user DTO
    const userDto = new UserDto(user);

    // 7) Send Email
    try {
      await new Email(userDto, url).sendVerificationUrl();
      return "Email sent with invitation";
    } catch {
      await user.deleteToken();
      throw new AppError(
        "There was an error sending the email. Try again later!",
        500
      );
    }
  }

  async verifyUrl(token) {
    // 1) hash received Token
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    // 2) get user existing Token where it email is not verified
    const user = await userRepository.getUserByInvitationToken(hashedToken);

    // 3) compare both Tokens and if valid then update email status
    if (user && !token === user.invitationToken) {
      throw new AppError(
        "The Token is invalid or the email is already verified",
        400
      );
    }
    await user.verifyEmail();

    const userDto = new UserDto(user);

    // 4) send confirmation email to user
    try {
      await new Email(userDto).sendConfirmEmail();
      return "Email is verified";
    } catch {
      await user.deleteVerifyEmail();
      throw new AppError(
        "There was an error sending the confirmation email. Try again later!",
        500
      );
    }
  }
}

module.exports = new emailVerficaitionService();

const AppError = require("../utils/appError");
const logger = require("../logging/index");
const userRepository = require("../repositories/userRepository");
const SMS = require("../jobs/SMSJob");

class mobileRegisterationService {
  async registerMobileNumber(mobileNumber) {
    // generate random verification number and expires date
    const mobileVerificationNumber = Math.floor(Math.random() * 10000);
    const mobileVerificationNumberExpires = Date.now() + 10 * 1000;
    let user;

    const existingUser = await userRepository.getUserByMobile(
      mobileNumber,
      false
    );
    console.log(existingUser.id);
    // check if mobile is soft deleted
    if (existingUser && existingUser.deletedAt) {
      await existingUser.restore();
      logger.info("User restored successfully");
      await userRepository.updateUser(existingUser.id, {
        mobileNumberVerified: false,
        mobileVerificationNumber,
        mobileVerificationNumberExpires,
      });
      logger.info(
        `Mobile Number ${mobileNumber} was soft deleted and new verification number is created`
      );
      user = await userRepository.getUser(existingUser.id);
    }

    // check if mobile is already verified
    else if (existingUser && existingUser.mobileNumberVerified === true) {
      throw new AppError("This mobile number is already verified", 400);
    }

    // Check if mobile is not verified
    else if (existingUser && !existingUser.mobileNumberVerified) {
      logger.info(
        `Mobile Number ${existingUser.mobileNumber} is already existing in database but not verified`
      );
      await userRepository.updateUser(existingUser.id, {
        mobileVerificationNumber,
        mobileVerificationNumberExpires,
      });
      user = await userRepository.getUser(existingUser.id);
    }

    // create user if not existing
    else if (!existingUser) {
      user = await userRepository.createUser({
        mobileNumber,
        mobileVerificationNumber,
        mobileVerificationNumberExpires,
      });
      logger.info(`Mobile Number ${user.mobileNumber} is added to database`);
    }

    const message = await new SMS(mobileNumber).sendVerifyMobile(
      mobileVerificationNumber
    );
    if (!message) {
      throw new AppError(
        "message not submitted. Something went wrong. Try again later",
        500
      );
    }
    logger.info(`Verification SMS is sent to ${mobileNumber}`);
    return user;
  }

  async verifyMobileNumber(id, verificationNumber) {
    const user = await userRepository.getUser(id);
    // Check id exist
    if (!user) {
      throw new AppError("The id don't exist in database", 400);
    }

    // check mobile number is not verified
    if (user.mobileNumberVerified) {
      throw new AppError("This mobile number is already verified", 400);
    }

    // check verification number is correct
    if (verificationNumber * 1 !== user.mobileVerificationNumber) {
      await userRepository.updateUser(user.id, {
        mobileVerificationNumber: null,
        mobileVerificationNumberExpires: null,
      });
      await userRepository.deleteUser(user.id);
      throw new AppError(
        "The submitted verification number is wrong. Resend verification number request",
        400
      );
    }
    // check verification number is not expired
    if (
      user.mobileVerificationNumberExpires &&
      user.mobileVerificationNumberExpires < Date.now()
    ) {
      await userRepository.deleteUser(user.id);
      throw new AppError(
        "The submitted verification number is expired. Resend verification number request",
        400
      );
    }

    const userData = {
      mobileVerificationNumberExpires: null,
      mobileVerificationNumber: null,
      mobileNumberVerified: true,
    };
    // verify mobile number
    const [userUpdateStatus] = await userRepository.updateUser(
      user.id,
      userData
    );

    if (userUpdateStatus === 0) {
      throw new AppError(
        "The mobile number is verified. Something went wrong",
        500
      );
    }
    return "The mobile number is verified";
  }
}

module.exports = new mobileRegisterationService();

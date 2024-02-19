const AppError = require("../utils/appError");
const logger = require("../logging/index");
const catchAsync = require("../utils/catchAsync");
const APIFeatures = require("../utils/apiFeatures");
const userRepository = require("../repositories/userRepository");
const signToken = require("../utils/signToken");
const UserDto = require("../dto/userDto");
const SMS = require("../jobs/SMSJob");
const FCM = require("../jobs/notificationJob");

const {
  JWT_SECRET,
  JWT_COOKIE_EXPIRES_IN,
  NODE_ENV,
} = require("../config/env");
const { jwt, promisify } = require("../utils/npmPackages");

class AuthService {
  async createToken(user) {
    const token = signToken(user.id);

    const cookieOptions = {
      expires: new Date(
        Date.now() + JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
    };
    if (NODE_ENV === "production") cookieOptions.secure = true;
    return [token, cookieOptions];
  }

  async signup(id, userData) {
    // 1) check allowed fields
    const allowedFields = ["name", "email", "password", "photo"];
    Object.keys(userData).forEach((key) => {
      if (!allowedFields.includes(key)) {
        throw new AppError(
          `You do not have permission to update field ${key}`,
          403
        );
      }
    });

    // 2) assign user as client
    userData.role = "client";

    // 3) check password exists in userData
    if (!userData.password) {
      throw new AppError("Please enter your password", 400);
    }

    // 4) check that user is already exists
    const existingUser = await userRepository.getUser(id);
    if (!existingUser) {
      throw new AppError("User is not created by mobile number", 400);
    }

    // 5) check that mobile number is verified
    if (
      !existingUser.mobileNumber ||
      existingUser.mobileNumberVerified !== true
    ) {
      throw new AppError("User mobile number don't exist or not verified", 400);
    }

    // 6) update user with new data
    const [userUpdateStatus] = await userRepository.updateUser(id, userData);
    if (!userUpdateStatus) {
      throw new AppError("User data is not updated. Try again later", 500);
    }

    // 7) get updated user data
    const user = await userRepository.getUser(id);

    // 8) create Token
    const [token, cookieOptions] = await this.createToken(user);

    // 9) return user data and token
    return [user, token, cookieOptions];
  }

  async signin(mobile, password) {
    // 1) check if mobile number and password exist
    if (!mobile || !password) {
      throw new AppError("Please provide email and password!", 400);
    }

    // 2) get user by mobile number
    let attributes = Object.keys(userRepository.getAttributes());
    attributes = [...attributes, "password"];

    const user = await userRepository.getUserByMobile(mobile, true, attributes);
    // 1) check if mobile number and password exist
    if (!mobile || !password) {
      throw new AppError("Please provide email and password!", 400);
    }

    // 3) check if user exist and mobile verified
    if (!user || !user.mobileNumberVerified) {
      throw new AppError("Incorrect mobile number or not verified");
    }

    // 4) check if the account is currently locked
    if (user.lockUntil >= Date.now()) {
      const remainingTime = Math.ceil(
        (user.lockUntil - Date.now()) / 1000 / 60
      );
      throw new AppError(
        `Account locked. Try again in ${remainingTime} minutes.`,
        400
      );
    }

    // 5) Check if there have been five consecutive failed login attempts
    user.loginAttempts += 1;
    await user.save();

    if (user.loginAttempts === 5) {
      user.lockUntil = Date.now() + 60 * 60 * 1000;
      await user.save();
      throw new AppError(`Account locked. Try again in 60 minutes.`, 401);
    }

    // 6) Check if password is correct
    if (!(await user.correctPassword(password, user.password))) {
      throw new AppError(
        `Incorrect password. The number of remaining tries is ${
          5 - user.loginAttempts
        }.`,
        400
      );
    }

    // 7) reset loginAttempts
    user.lockUntil = 0;
    user.loginAttempts = 0;
    await user.save();

    // 8) create token to client
    const [token, cookieOptions] = await this.createToken(user);

    // 9) send log in notification --> testing purpose
    const fcmToken =
      "emRbuibfQiGmarU30IzWGh:APA91bGM4rXFh6UnYukCzUN_mCxQimCaSmTcD34ohNziZbav1V7P2BOaZNO6oAIIptooyDxvIzhmj9lKNN194MqkXbsCQzuPgVlp9cyLDs7hDcNQH4DCxomOe_39bUKR_HwvcOXqejX2";

    const notification = await new FCM(fcmToken).sendNotification(
      "test test Title2",
      "Test test text2"
    );
    // 10) return token, user, cookies options
    return [user, token, cookieOptions, notification];
  }

  async protect(authorization, cookiesjwt) {
    // 1) Check for Token
    let token;
    if (authorization && authorization.startsWith("Bearer")) {
      token = authorization.split(" ")[1];
    } else if (cookiesjwt) {
      token = cookiesjwt;
    }
    if (!token) {
      throw new AppError(
        "You are not logged in! Please log in to get access.",
        401
      );
    }

    // 2) decode Token
    const decoded = await promisify(jwt.verify)(token, JWT_SECRET);

    // 3) check if user exists
    const user = await userRepository.getUser(decoded.id);
    if (!user) {
      throw new AppError(
        "The user belonging to this token does no longer exist.",
        401
      );
    }
    // 4) check if password changed
    if (user.changedPasswordAfter(decoded.iat)) {
      throw new AppError(
        "User recently changed password! Please log in again.",
        401
      );
    }
    // 5) return user
    return user;
  }

  strictTo(role, next, ...roles) {
    if (!roles.includes(role)) {
      next(
        new AppError("You do not have permission to perform this action", 403)
      );
    }
  }

  async forgotPassword(mobileNumber, resetUrl, next) {
    // 1) Get user based on mobile number
    const user = await userRepository.getUserByMobile(mobileNumber, resetUrl);
    if (!user) {
      // return next(new AppError('There is no user with email address.', 404));
      throw new AppError("There is no user with this mobile number.", 404);
    }

    // 2) Generate random reset Token
    const resetToken = user.createPasswordResetToken();
    await user.save();

    // 3) Send message to user's mobile number
    resetUrl = `${resetUrl}${resetToken}`;

    // 4) Send verification message and return message
    try {
      await new SMS(mobileNumber).sendResetUrl(resetUrl);
      return `Message sent with reset link to ${mobileNumber}`;
    } catch {
      await user.deleteToken();
      throw new AppError(
        "There was an error sending the message. Try again later!",
        500
      );
    }
  }

  async resetPassword(token, password) {
    // 1a) password exist
    if (!password) {
      throw new AppError("Please provide new password!", 400);
    }

    // 1b) get user by token
    const user = await userRepository.getUserByResetToken(token);

    // 2) check if user exist and token not expired
    if (!user) {
      throw new AppError("Token is invalid or has expired", 400);
    }

    // 3) update the password
    user.password = password;
    await user.save();

    // 4) update passwordChangedAt field of the user --> from Model file
    // 5) create Token
    const [newtoken, cookieOptions] = await this.createToken(user);

    // 6) return user data and token
    return [user, newtoken, cookieOptions];
  }

  async updatePassword(id, password, newPassword) {
    // 1a) check that password and new password exists
    if (!password || !newPassword) {
      throw new AppError(
        "Please insert current password and new password",
        400
      );
    }

    // 1b) get user by id
    let attributes = Object.keys(userRepository.getAttributes());
    attributes = [...attributes, "password"];
    const user = await userRepository.getUser(id, attributes);
    if (!user) {
      throw new AppError("There is no user with this id", 400);
    }

    // 2) check password
    if (!(await user.correctPassword(password, user.password))) {
      throw new AppError("Your current password is wrong.", 401);
    }

    // 3) update password
    user.password = newPassword;
    await user.save();

    // 4) update passwordChangedAt field of the user --> from Model file
    // 5) create Token
    const [token, cookieOptions] = await this.createToken(user);

    // 6) return user data and token
    return [user, token, cookieOptions];
  }
}

module.exports = new AuthService();

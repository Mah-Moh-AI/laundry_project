const User = require("../models/userModel");
const AppError = require("../utils/appError");
const logger = require("../logging/index");
const { Sequelize } = require("../utils/npmPackages");
const { Op } = Sequelize;

// Synchronize the User model with the database
// check if async is required --> Later
User.sync({ force: false, alter: false })
  .then(() => {
    logger.info("User table created (if not exists) successfully");
  })
  .catch((error) => {
    logger.error("Error creating User table:", error);
    return new AppError(`Error creating User table`, 500);
  });

// CRUD operations
exports.getAllUsers = async (query) => {
  return await User.scope("active").findAll(query); // the query override default scope --> this is to be checked later
};

exports.createUser = async (data) => {
  return await User.create(data);
};

exports.getUser = async (id, attributes) => {
  return await User.scope("active").findByPk(id, { attributes });
};

exports.updateUser = async (id, data) => {
  console.log("repo: ", data);
  return await User.update(data, {
    where: { id },
    individualHooks: true,
  });
};

exports.deleteUser = async (id) => {
  return await User.update(
    { deletedAt: Date.now() },
    {
      where: { id },
      individualHooks: true,
    }
  );
};

exports.getUserByMobile = async (mobileNumber, paranoid, attributes) => {
  const user = await User.findOne({
    where: { mobileNumber },
    paranoid,
    attributes,
  });
  return user;
};

exports.getUserByField = async (fields) => {
  const user = await User.findOne({ where: fields });
  return user;
};

exports.getUserByInvitationToken = async (invitationToken) => {
  const user = await User.findOne({
    where: { invitationToken, emailVerified: { [Op["ne"]]: true } },
  });
  return user;
};

exports.getUserByResetToken = async (passwordResetToken) => {
  const user = await User.findOne({
    where: {
      passwordResetToken,
      passwordResetExpires: { [Op["gte"]]: Date.now() },
    },
  });
  return user;
};

exports.getAttributes = () => {
  return User.getAttributes();
};

// exports.updateUser = async (id, userData) => {
//   const existingUser = await User.findByPk(id);

//   if (!existingUser) {
//     return new AppError(`user with ID ${id} not found`, 404);
//   }
//   const [rowsUpdated] = await User.update(userData, {
//     where: { id },
//   });
//   console.log(rowsUpdated);
//   if (rowsUpdated === 0) {
//     return new AppError(`No changes made to user with ID ${id}`, 400);
//   }
//   const updatedUser = await User.findByPk(id);
//   if (!updatedUser) {
//     return new AppError(`Error during updating user: ${id}`, 500);
//   }
//   return updatedUser;
// };

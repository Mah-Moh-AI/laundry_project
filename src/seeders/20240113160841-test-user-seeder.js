"use strict";
const sampleUserData = require("../dev-data/userInitData");
const { bcrypt } = require("../utils/npmPackages");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const hashedSampleData = sampleUserData.map((user) => ({
      ...user,
      password: bcrypt.hashSync(user.password, 12), // Hash passwords before inserting
      createdAt: new Date(),
      lastUpdatedAt: new Date(),
    }));
    console.log(hashedSampleData);
    await queryInterface.bulkInsert("Users", hashedSampleData, {});
  },

  async down(queryInterface, Sequelize) {
    // Delete the data that was inserted in the up function
    const userMobileNumber = sampleUserData.map((user) => user.mobileNumber); // Assuming there's an 'email' field in your sample data

    // Delete the users based on their email addresses
    await queryInterface.bulkDelete("Users", {
      mobileNumber: userMobileNumber,
    });
  },
};

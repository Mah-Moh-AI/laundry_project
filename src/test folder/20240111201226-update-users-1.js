"use strict";

/** @type {import('sequelize-cli').Migration} */
// const sequelize = require("../config/database");
const { Sequelize } = require("../utils/npmPackages");
const { DataTypes } = Sequelize;
const User = require("../models/userModel");

const env = require("../config/env");
const logger = require("../logging/index");
const sequelize = new Sequelize(
  env.MYSQL_DATABASE,
  env.MYSQL_USER,
  env.MYSQL_PASSWORD,
  {
    host: env.MYSQL_HOST,
    dialect: "mysql",
    logging: (sql, timing) => {
      logger.info(`SQL Query: ${sql}`);
      // logger.info(`Execution Time: ${timing}ms`);
    },
    // logging: (msg) => logger.info(msg),
  }
);
module.exports = {
  async up() {
    await sequelize.transaction(async (t) => {
      await User.addColumn("newColumn", {
        type: DataTypes.STRING,
        allowNull: true,
        transaction: t,
      });

      await User.update(
        { newColumn: "Default" },
        { where: { newColumn: null }, transaction: t }
      );
    });
  },

  async down() {
    await sequelize.transaction(async (t) => {
      // Remove the "newColumn" column using the User model
      await User.removeColumn("newColumn", { transaction: t });
    });
  },

  //   async up(queryInterface, Sequelize) {
  //     // Add altering commands here.

  //     await queryInterface.addColumn("Users", "newColumn", {
  //       type: Sequelize.STRING,
  //       allowNull: true,
  //     });
  //   },

  //   async down(queryInterface, Sequelize) {
  //     // Reverse any other changes made during the 'up' method
  //     await queryInterface.removeColumn("Users", "newColumn");
  //   },
};

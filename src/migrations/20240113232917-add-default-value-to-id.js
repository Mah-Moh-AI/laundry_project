"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      ALTER TABLE users
      MODIFY COLUMN id CHAR(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL DEFAULT (UUID());
    `);
    //
    // await queryInterface.changeColumn("users", "id", {
    //   type: Sequelize.UUID,
    //   defaultValue: Sequelize.literal("(UUID())"),
    //   allowNull: false,
    //   primaryKey: true,
    // });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      ALTER TABLE users
      MODIFY COLUMN id CHAR(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL;
    `);
    // // Revert the changes made in the 'up' method
    // await queryInterface.changeColumn("users", "id", {
    //   type: Sequelize.UUID,
    //   allowNull: false,
    //   primaryKey: true,
    // });
  },
};

"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
    CREATE TRIGGER before_insert_users
    BEFORE INSERT ON users
    FOR EACH ROW
    BEGIN
    IF new.id IS NULL THEN
    SET new.id = uuid();
    END IF;
    END
    `);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
    drop trigger before_insert_users;
    `);
  },
};

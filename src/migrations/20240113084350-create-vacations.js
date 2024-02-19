"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      // Create the Vacations table
      await queryInterface.createTable(
        "Vacations",
        {
          id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            allowNull: false,
            primaryKey: true,
          },
          type: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          date: {
            type: Sequelize.DATE,
            allowNull: false,
          },
          userId: {
            type: Sequelize.UUID,
            allowNull: false,
            // references: { // this another way to create a FK
            //   model: "Users",
            //   key: "id",
            //   type: Sequelize.UUID, // Add this line
            // },
            // onUpdate: "CASCADE",
            // onDelete: "CASCADE",
            // collate: "utf8_general_ci",
            // charset: "utf8",
          },
          createdAt: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
          },
          updatedAt: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
          },
        },
        { transaction }
      );

      // Define association
      await queryInterface.addConstraint(
        "Vacations",
        {
          type: "foreign key",
          fields: ["userId"],
          references: {
            table: "Users",
            field: "id",
          },
        },
        { transaction }
      );

      // Add a unique constraint for user and date
      await queryInterface.addConstraint(
        "Vacations",
        {
          fields: ["userId", "date"],
          type: "unique",
          name: "unique_user_date",
        },
        { transaction }
      );
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      // Remove constraints and drop the Vacations table

      // await queryInterface.removeConstraint(
      //   "Vacations",
      //   "Vacations_userId_Users_fk",
      //   { transaction }
      // );
      // await queryInterface.removeConstraint("Vacations", "unique_user_date", {
      //   transaction,
      // });
      await queryInterface.dropTable("Vacations", { transaction });
    });
  },
};

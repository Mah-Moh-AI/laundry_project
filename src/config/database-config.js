// sequelize-config.js --> not used. Just for reference in case several databases are required
const { path } = require("../utils/npmPackages");
const logger = require("../logging/index");
const {
  MYSQL_DATABASE,
  MYSQL_USER,
  MYSQL_PASSWORD,
  MYSQL_HOST,
} = require("./env");

module.exports = {
  development: {
    username: MYSQL_USER,
    password: MYSQL_PASSWORD,
    database: MYSQL_DATABASE,
    host: MYSQL_HOST,
    dialect: "mysql",
    port: 3306,
    logging: (sql, timing) => {
      logger.info(`SQL Query: ${sql}`);
    },
  },
  // Add other environments if needed (test, production, etc.)
};

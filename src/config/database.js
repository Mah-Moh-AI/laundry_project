const { Sequelize } = require("../utils/npmPackages");
const {
  MYSQL_DATABASE,
  MYSQL_USER,
  MYSQL_PASSWORD,
  MYSQL_HOST,
} = require("./env");
const logger = require("../logging/index");

const sequelize = new Sequelize(MYSQL_DATABASE, MYSQL_USER, MYSQL_PASSWORD, {
  host: MYSQL_HOST,
  dialect: "mysql",
  logging: (sql, timing) => {
    logger.info(`SQL Query: ${sql}`);
    // logger.info(`Execution Time: ${timing}ms`);
  },
  // logging: (msg) => logger.info(msg),
});

module.exports = sequelize;
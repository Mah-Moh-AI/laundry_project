const npmPackages = require("../utils/npmPackages");
const env = require("./env");
const logger = require("../logging/index");

const sequelize = new npmPackages.Sequelize(
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

module.exports = sequelize;

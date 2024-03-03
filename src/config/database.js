const { Sequelize } = require("../utils/npmPackages");
const {
  MYSQL_DATABASE,
  MYSQL_USER,
  MYSQL_PASSWORD,
  MYSQL_HOST,
  MYSQL_PORT,
  GCP_MYSQL_DATABASE,
  GCP_MYSQL_HOST,
  GCP_MYSQL_PASSWORD,
  GCP_MYSQL_PORT,
  GCP_MYSQL_SOCKETPATH,
  GCP_MYSQL_USER,
  NODE_ENV,
} = require("./env");
const logger = require("../logging/index");
let sequelize;
if (NODE_ENV === "development") {
  sequelize = new Sequelize(MYSQL_DATABASE, MYSQL_USER, MYSQL_PASSWORD, {
    host: MYSQL_HOST,
    port: MYSQL_PORT,
    dialect: "mysql",
    logging: (sql, timing) => {
      logger.info(`SQL Query: ${sql}`);
      // logger.info(`Execution Time: ${timing}ms`);
    },
    // logging: (msg) => logger.info(msg),
  });
} else {
  sequelize = new Sequelize(
    GCP_MYSQL_DATABASE,
    GCP_MYSQL_USER,
    GCP_MYSQL_PASSWORD,
    {
      host: GCP_MYSQL_HOST,
      port: GCP_MYSQL_PORT,
      dialect: "mysql",
      logging: (sql, timing) => {
        logger.info(`SQL Query: ${sql}`);
        // logger.info(`Execution Time: ${timing}ms`);
      },
      // logging: (msg) => logger.info(msg),
      dialectOptions: {
        socketPath: GCP_MYSQL_SOCKETPATH,
      },
    }
  );
}
module.exports = sequelize;

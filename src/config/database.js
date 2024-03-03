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
const { Console } = require("winston/lib/winston/transports");
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
  console.log("production database");
  sequelize = new Sequelize(
    GCP_MYSQL_DATABASE,
    GCP_MYSQL_USER,
    GCP_MYSQL_PASSWORD,
    {
      host: "/cloudsql/pushnotificationfcmtest:us-south1:laundry1db",
      dialect: "mysql",
      dialectOptions: {
        socketPath: "/cloudsql/pushnotificationfcmtest:us-south1:laundry1db",
      },
    }
  );
}
module.exports = sequelize;

// import files
const npmPackages = require("./src/utils/npmPackages");
const env = require("./src/config/env");
const logger = require("./src/logging/index");
const sequelize = require("./src/config/database");

// uncaught Exception handling
process.on("uncaughtException", (err) => {
  logger.info("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  logger.error(err.name, err.message);
  process.exit(1);
});

// call express file
const app = require("./app");

// connect to database
sequelize
  .authenticate()
  .then(() => {
    logger.info("Connection to database has been established successfully.");
  })
  .catch((error) => {
    logger.error("Unable to connect to the database: ", error);
  });

const server = app.listen(env.PORT, () => {
  logger.info(`App running on port ${env.PORT}...`);
});

// unhandeled Rejection
process.on("unhandledRejection", (err) => {
  logger.info("UNHANDLED REJECTION! 💥 Shutting down...");
  logger.error(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

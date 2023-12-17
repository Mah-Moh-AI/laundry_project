const npmPackages = require("../utils/npmPackages");
const DailyRotateFile = npmPackages.DailyRotateFile;
const logger = require("./logger");
const sequelizeLogger = require("./databaseLogger");

// Production-specific transport
logger.add(
  new DailyRotateFile({
    filename: "./src/logs/%DATE%-app.log",
    datePattern: "YYYY-MM-DD",
    zippedArchive: true,
    maxSize: "5m",
    maxFiles: "3d",
    level: "info",
  })
);

// sequelizeLogger();

module.exports = logger;

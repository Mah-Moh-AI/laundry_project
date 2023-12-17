const npmPackages = require("../utils/npmPackages");
const sequelizeLogger = require("./databaseLogger");
const { format, createLogger, transports } = npmPackages.winston;
const { combine, timestamp, printf } = format;

const logger = require("./logger");

// Add a development-specific transport (console logging)
logger.add(
  new transports.Console({
    format: combine(
      format.colorize(),
      format.errors({ stack: true }),
      format.simple()
    ),
    level: "debug",
  })
);

// sequelizeLogger(); // check as location might be changed. The same for production file

module.exports = logger;

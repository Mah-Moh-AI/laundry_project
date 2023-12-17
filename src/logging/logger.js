const npmPackages = require("../utils/npmPackages");

const { format, createLogger, transports } = npmPackages.winston;
const { combine, timestamp, printf } = format;

// Define a custom log format
const logFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level.toUpperCase()}]: ${message}`;
});

// Create a Winston logger instance
const logger = createLogger({
  format: combine(
    timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    logFormat
  ),
});

module.exports = logger;

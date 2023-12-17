const env = require("../config/env");

const logger =
  env.NODE_ENV === "development"
    ? require("./developmentLogger") && require("./productionLogger")
    : require("./productionLogger");

module.exports = logger;

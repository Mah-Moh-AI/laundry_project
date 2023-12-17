const npmPackages = require("../utils/npmPackages");

const dotenv = npmPackages.dotenv;
dotenv.config({ path: "./.env" });
module.exports = {
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT || 3000,
  MYSQL_HOST: process.env.MYSQL_HOST || "127.0.0.1",
  MYSQL_USER: process.env.MYSQL_USER || "root",
  MYSQL_PASSWORD: process.env.MYSQL_PASSWORD,
  MYSQL_DATABASE: process.env.MYSQL_DATABASE,
};

const { Sequelize } = require("../utils/npmPackages");
const {
  MYSQL_HOST,
  MYSQL_USER,
  MYSQL_PASSWORD,
  MYSQL_DATABASE,
} = require("./env");

// module.exports = sequelize;
module.exports = module.exports = {
  development: {
    username: "root",
    password: "Galelio88!",
    database: "Laundry_project_db",
    host: "localhost",
    // port: 3306,
    dialect: "mysql",
    dialectOptions: {
      bigNumberStrings: true,
    },
  },
};

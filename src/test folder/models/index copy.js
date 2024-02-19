"use strict";
// this file is not used. It was for learning purpose only for next projects. It hase an error
const { fs, path, Sequelize, process } = require("../utils/npmPackages");
// const sequelize = require("../config/database");
const env = require("../config/env").NODE_ENV || "development";
const basename = path.basename(__filename);
const config = require(__dirname + "/../config/database-config.js")[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );
}

fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 &&
      file !== basename &&
      file.slice(-3) === ".js" &&
      file.indexOf(".test.js") === -1
    );
  })
  .forEach((file) => {
    const modelDefiner = require(path.join(__dirname, file));
    const model = modelDefiner(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;

const { Sequelize } = require("../utils/npmPackages");
const { DataTypes } = Sequelize;
const sequelize = require("../config/database");
const logger = require("../logging/index");

const LocationHistory = sequelize.define("LocationHistory", {
  locationId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  action: {
    type: DataTypes.STRING, // 'update' or 'delete'
    allowNull: false,
  },
  changes: {
    type: DataTypes.JSON,
    allowNull: true, // Changes can be null for deletions
  },
  previousData: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  timestamp: {
    type: DataTypes.DATE,
    allowNull: false,
  },
});

(async () => {
  await LocationHistory.sync({ force: false });
  logger.info("Location History Database synchronized");
})();

module.exports = LocationHistory;
const { Sequelize } = require("../utils/npmPackages");
const { DataTypes } = Sequelize;
const sequelize = require("../config/database");
const logger = require("../logging/index");

const DeliveryRoutingHistory = sequelize.define("DeliveryRoutingHistory", {
  deliveryRoutingId: {
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
  await DeliveryRoutingHistory.sync({ force: false });
  logger.info("DeliveryRouting History Database synchronized");
})();

module.exports = DeliveryRoutingHistory;

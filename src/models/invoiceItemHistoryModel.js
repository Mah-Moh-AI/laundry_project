const { Sequelize } = require("../utils/npmPackages");
const { DataTypes } = Sequelize;
const sequelize = require("../config/database");
const logger = require("../logging/index");

const InvoiceItemHistory = sequelize.define("InvoiceItemHistory", {
  invoiceItemId: {
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
  await InvoiceItemHistory.sync({ force: false });
  logger.info("InvoiceItem History Database synchronized");
})();

module.exports = InvoiceItemHistory;

const { Sequelize } = require("../utils/npmPackages");
const { Op } = Sequelize;
const userRepository = require("../repositories/userRepository");
const logger = require("../logging");

class APIFeatures {
  constructor(queryString) {
    this.queryString = queryString;
    this.query = {};
  }

  features() {
    const { page, sort, limit, fields, ...filters } = this.queryString;
    // dynamic filtering
    const updatedFilters = {};
    Object.keys(filters).forEach((key) => {
      if (!filters[key].includes(":")) {
        return (updatedFilters[key] = filters[key]);
      }
      const [operator, value] = filters[key].split(":");

      switch (operator) {
        case "eq":
          updatedFilters[key] = value;
          break;
        case "gt":
        case "lt":
        case "gte":
        case "lte":
          updatedFilters[key] = { [Op[operator]]: value };
          break;
        default:
          logger.warn(`Unknown operator: ${operator} for filter key: ${key}`);
      }
    });
    // sorting
    let sortBy = sort ? sort.split(",") : ["-createdAt"];
    sortBy = sortBy.map((field) =>
      field.startsWith("-") ? [field.substring(1), "DESC"] : [field, "ASC"]
    );
    // field selection
    const attributes = fields
      ? fields.split(",").map((field) => field.trim())
      : null;

    // Pagination
    const featureLimit = limit && !isNaN(limit) ? limit * 1 : 10;
    const startIndex = page && !isNaN(page) ? (page - 1) * featureLimit : 0;
    // const endIndex = page * limit;
    console.log(sortBy);
    this.query = {
      where: updatedFilters,
      order: sortBy,
      attributes,
      offset: startIndex,
      limit: featureLimit,
    };
    return this;
  }
}

module.exports = APIFeatures;

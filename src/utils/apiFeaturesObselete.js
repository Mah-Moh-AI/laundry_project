// Obselte --> for reference
const userRepository = require("../repositories/userRepository");

class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  features() {
    const { page, sort, limit, fields, ...filters } = this.queryString;

    // sorting
    const sortBy = sort ? sort.split(",") : ["createdAt"];

    // field selection
    const attributes = fields
      ? fields.split(",").map((field) => field.trim())
      : null;

    // Pagination
    const startIndex = page ? (page - 1) * limit : 0;
    // const endIndex = page * limit;

    this.query = userRepository.getAllUsers({
      where: filters,
      order: sortBy,
      attributes,
      offset: startIndex,
      limit: limit * 1,
    });
    return this;
  }
}

module.exports = APIFeatures;

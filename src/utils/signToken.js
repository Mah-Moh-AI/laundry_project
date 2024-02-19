const { JWT_SECRET, JWT_EXPIRES_IN } = require("../config/env");
const npmPackages = require("./npmPackages");
const { jwt } = npmPackages;

const signToken = (id) =>
  jwt.sign({ id }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });

module.exports = signToken;

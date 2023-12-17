// utility class that encapsulates commonly used npm packages
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const winston = require("winston");
const { Sequelize } = require("sequelize");
const dotenv = require("dotenv");
const mysql = require("mysql2");
const morgan = require("morgan");
const DailyRotateFile = require("winston-daily-rotate-file");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const xss = require("xss-clean");
const hpp = require("hpp");
const path = require("path");
const cookieParser = require("cookie-parser");

class NpmPackages {
  constructor(options = {}) {
    this.express = express;
    // this.express.use(bodyParser.json()); // express.json middleware is used in app.js file
    // this.express.use(cors(options.corsOptions)); // shall be moved to app.js in case needed

    this.jwt = jwt;
    this.winston = winston;
    this.helmet = helmet;
    this.rateLimit = rateLimit;
    this.xss = xss;
    this.hpp = hpp;
    this.path = path;
    this.cookieParser = cookieParser;
    this.morgan = morgan;
  }

  get Sequelize() {
    return Sequelize;
  }

  get dotenv() {
    return dotenv;
  }

  get mysql() {
    return mysql;
  }

  get DailyRotateFile() {
    return DailyRotateFile;
  }
}

const npmPackages = new NpmPackages({
  corsOptions: {
    // origin: "",
    // methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    // credentials: true,
  },
});

module.exports = npmPackages;

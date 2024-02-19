// utility class that encapsulates commonly used npm packages
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const winston = require("winston");
const { Sequelize, Model } = require("sequelize");
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
const fs = require("fs");
const process = require("process");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const twilio = require("twilio");
const nodemailer = require("nodemailer");
const { promisify } = require("util");
const axios = require("axios");
const NodeCache = require("node-cache");
const redis = require("redis");
const PDFDocument = require("pdfkit");
const i18next = require("i18next");
const i18nextMiddleware = require("i18next-express-middleware");
const compression = require("compression");

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
    this.fs = fs;
    this.process = process;
    this.bcrypt = bcrypt;
    this.crypto = crypto;
    this.nodemailer = nodemailer;
    this.promisify = promisify;
    this.Model = Model;
    this.axios = axios;
    this.NodeCache = NodeCache;
    this.redis = redis;
    this.PDFDocument = PDFDocument;
    this.i18next = i18next;
    this.i18nextMiddleware = i18nextMiddleware;
    this.compression = compression;
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

  get twilio() {
    return twilio;
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

// import files
const npmPackages = require("./src/utils/npmPackages");
const env = require("./src/config/env");
const logger = require("./src/logging/index");
require("./src/models/associations/associations");
require("./src/config/i18next-config"); // Configure i18next

// npm
const {
  express,
  helmet,
  rateLimit,
  xss,
  hpp,
  path,
  cookieParser,
  morgan,
  i18nextMiddleware,
  i18next,
  compression,
  cors,
} = npmPackages;

// errors Handler/utils import
const globalErrorHandler = require("./src/handlers/errorsHandler");
const AppError = require("./src/utils/appError");

// import app
const app = express();

// Use cors middleware before compression
app.use(cors());

// Use compression middleware
app.use(compression()); // not tested

// Routes
const userRouter = require("./src/routes/userRoute");
const clientRouter = require("./src/routes/clientRoute");
const branchRouter = require("./src/routes/branchRoute");
const mobileRegisterationRouter = require("./src/routes/MobileRegisterationRoute");
const emailVerificationRouter = require("./src/routes/emailVerificationRoute");
const deliveryTypeRouter = require("./src/routes/deliveryTypeRoute");
const serviceOptionRouter = require("./src/routes/serviceOptionRoute");
const servicePreferenceRouter = require("./src/routes/servicePreferenceRoute");
const clothesTypeRouter = require("./src/routes/clothesTypeRoute");
const ServiceRouter = require("./src/routes/serviceRoute");
const itemServiceRouter = require("./src/routes/itemServiceRoute");
const orderRouter = require("./src/routes/orderRoute");
const locationRouter = require("./src/routes/locationRoute");
const deliveryRoutingRouter = require("./src/routes/deliveryRoutingRoute");
const deliveryPointRouter = require("./src/routes/deliveryPointRoute");
const deliveryWorkerRouter = require("./src/routes/deliveryWorkerRoute");
const invoiceRouter = require("./src/routes/invoiceRoute");
const invoiceItemRouter = require("./src/routes/invoiceItemRoute");
const setLanguageMiddleware = require("./src/middleware/setLanguageMiddleware");

// Use i18next middleware
app.use(i18nextMiddleware.handle(i18next));

// setup language middleware
app.use(setLanguageMiddleware);

// Serving static files
app.use(express.static(path.join(__dirname, "public")));

// Set security HTTP headers
app.use(helmet());

// Development logging
if (env.NODE_ENV === "development") {
  app.use(morgan("dev"));

  app.use(
    morgan("tiny", {
      stream: {
        write: (message) => logger.http(message.trim()),
      },
    })
  );
}
// Limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour!",
});
app.use("/api", limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      // to be added during project execution
    ],
  })
);

// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.use("/api/v1/users", userRouter);
app.use("/api/v1/clients", clientRouter);
app.use("/api/v1/branches", branchRouter);
app.use("/api/v1/mobile", mobileRegisterationRouter);
app.use("/api/v1/email", emailVerificationRouter);
app.use("/api/v1/deliverytypes", deliveryTypeRouter);
app.use("/api/v1/serviceoptions", serviceOptionRouter);
app.use("/api/v1/servicepreferences", servicePreferenceRouter);
app.use("/api/v1/clothestypes", clothesTypeRouter);
app.use("/api/v1/services", ServiceRouter);
app.use("/api/v1/itemservices", itemServiceRouter);
app.use("/api/v1/orders", orderRouter);
app.use("/api/v1/locations", locationRouter);
app.use("/api/v1/deliveryroutings", deliveryRoutingRouter);
app.use("/api/v1/deliverypoints", deliveryPointRouter);
app.use("/api/v1/deliveryworkers", deliveryWorkerRouter);
app.use("/api/v1/invoices", invoiceRouter);
app.use("/api/v1/invoiceitems", invoiceItemRouter);

// send error incase of wrong url
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;

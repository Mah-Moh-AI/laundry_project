// import files
const npmPackages = require("./src/utils/npmPackages");
const env = require("./src/config/env");
const logger = require("./src/logging/index");

// npm
const { express, helmet, rateLimit, xss, hpp, path, cookieParser, morgan } =
  npmPackages;

// errors Handler/utils import
const globalErrorHandler = require("./src/handlers/errorsHandler");
const AppError = require("./src/utils/appError");

// import app
const app = express();

// Routes
const userRouter = require("./src/routes/userRoute");

// Serving static files
app.use(express.static(path.join(__dirname, "public")));

// Set security HTTP headers
app.use(helmet());

// Development logging
if (env.NODE_ENV === "development") {
  app.use(morgan("dev"));
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

// send error incase of wrong url
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;

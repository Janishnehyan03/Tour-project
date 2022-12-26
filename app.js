const express = require("express");
const morgan = require("morgan");
const app = express();
const path = require("path");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const cookieParser = require("cookie-parser");
const hpp = require("hpp");
const compression = require("compression");
const bodyParser = require("body-parser");

const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");
const viewRouter = require("./routes/viewRoutes");
const tourRouter = require("./routes/tourRoutes");
const userRouter = require("./routes/userRoutes");
const reviewRouter = require("./routes/reviewRoutes");
const bookingRouter = require("./routes/bookingRouter");
const bookingController = require("./controllers/bookingController");
const cors = require("cors");
app.enable("trust proxy");

//middlewares
app.use(helmet()); //set security HTTP

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Limit requests
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000, //100 requests in one hour,
  message: "Too many requests, please try again after one hour",
});

app.use("/api", limiter);

app.post(
  "/webhook-checkout",
  bodyParser.raw({ type: "application/json" }),
  bookingController.webhookCheckout
); //don't use this below JSON,
//because it can't accept any JSON data

//view engine
app.set("view engine", "pug");
app.use(express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "views"));
//implementing cors
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.options("*", cors());
// app.options('/api/v1/tours',cors())

app.use(express.json({ limit: "10kb" }));
app.use(cookieParser()); //reads cookie
//data sanitization against NoSql attacks
app.use(mongoSanitize());
//data sanitization against xss
app.use(xss()); //prevent from inserting HTML or others to DB
//prevent form Parameter Pollution
app.use(
  hpp({
    whitelist: [
      //whiteList allows to make multiple parameters
      "duration",
      "ratingsAverage",
      "ratingsQuantity",
      "maxGroupSize",
      "difficulty",
      "price",
    ],
  })
);

app.use(compression()); //works on texts

//Routes

app.use("/", viewRouter);
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/reviews", reviewRouter);
app.use("/api/v1/bookings", bookingRouter);
//Route error handler (works only if above routes didn't work)
app.all("*", (req, res, next) => {
  // * stand for every routes
  // const err = new Error(`Cant find ${req.originalUrl} on the server`);
  // err.status = "fail";
  // err.statusCode = 404;
  next(new AppError(`Cant find ${req.originalUrl}  on the server`, 404));
});

app.use(globalErrorHandler);
//starts our app
module.exports = app;

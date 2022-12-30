const AppError = require("../utils/appError");

const handleCastErrorDB = (err) => {
  const message = `invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};
const handleDuplicateFieldsDB = (err) => {
  const value = err.value; //.match(/(["'])(?:(?=(\\?))\2.)*?\1/)[0];
  const message = `duplicate field , please use another`;
  return new AppError(message, 400);
};
const handleValidationErrorDB = () => {
  const message = `invalid input data`;
  return new AppError(message, 400);
};
const handleJWTError = () =>
  new AppError("Invalid token, please login error", 404);

const handleJWTExpiredError = () =>
  new AppError("your token expired, please try again", 401);

const sendErrorDev = (err, req, res) => {
  console.log("error", err);
  //API
  if (req.originalUrl.startsWith("/api")) {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  }
  //RENDERED WEBSITE
  return res.status(err.statusCode).render("error", {
    title: "Something went wrong",
    msg: err.message,
  });
};
const sendErrorProd = (err, req, res) => {
  // //API
  // if (req.originalUrl.startsWith("/api")) {
  //   if (err.isOperational) {
  //     res.status(err.statusCode).json({
  //       status: err.status,
  //       message: err.message,
  //     });
  //   }
  //
  //RENDERED WEBSITE
  if (err.isOperational) {
    return res.status(err.statusCode).render("error", {
      title: "Something went wrong",
      msg: err.message,
    });
  }
  // send generic message
  return res.status(err.statusCode).render("error", {
    title: "Something went wrong",
    msg: "Please try again later",
  });
};
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  res.status(err.statusCode).json({ err });
  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = { ...err };
    error.message = err.message;
    if (err.name === "CastError") error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === "ValidatorError") error = handleValidationErrorDB(error);
    if (err.name === "JsonWebTokenError") error = handleJWTError(err);
    if (err.name === "TokenExpiredError") error = handleJWTExpiredError();

    // sendErrorProd(error, req, res);
  }
};

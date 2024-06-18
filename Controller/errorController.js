const AppError = require("../Utilities/appErrors");

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  console.log(message);
  return new AppError(message, 400);
};
const handleJWTError = () =>
  new AppError("Invalid Token! Please login again.", 401);
const handleTokenExpiresError = () =>
  new AppError("Your token has expired! Please login again.", 401);

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    if (req.originalUrl.startsWith("/api")) {
      let error = { ...err };
      console.log(err);

      if (err.name === "CastError") {
        error = handleCastErrorDB(err);
        res.status(err.statusCode).json({
          status: error.status,
          message: error.message,
        });
      } else if (err.name === "JsonWebTokenError") {
        error = handleJWTError();
        res.status(err.statusCode).json({
          status: error.status,
          message: error.message,
        });
      } else if (err.name === "TokenExpiredError") {
        error = handleTokenExpiresError();
        res.status(err.statusCode).json({
          status: error.status,
          message: error.message,
        });
      } else {
        res.status(err.statusCode).json({
          status: err.status,
          error: err,
          message: err.message,
          stack: err.stack,
        });
      }
      next();
    } else {
      let error = { ...err };

      if (err.name === "CastError") {
        error = handleCastErrorDB(err);
        res.status(err.statusCode).render("error", {
          title: "Something went wrong",
          msg: err.message,
        });
      } else if (err.name === "JsonWebTokenError") {
        error = handleJWTError();
        res.status(err.statusCode).render("error", {
          title: "Something went wrong",
          msg: err.message,
        });
      } else if (err.name === "TokenExpiredError") {
        error = handleTokenExpiresError();
        res.status(err.statusCode).render("error", {
          title: "Something went wrong",
          msg: err.message,
        });
      } else {
        res.status(err.statusCode).render("error", {
          status: err.status,
          title: "Something went wrong",
          error: err,
          msg: err.message,
          stack: err.stack,
        });
      }
      next();
    }
  } else if (process.env.NODE_ENV === "production") {
    if (req.originalUrl.startsWith("/api")) {
      let error = { ...err };
      console.log(error);
      if (error.name === "CastError") error = handleCastErrorDB(error);
      if (error.name === "JsonWebTokenError") error = handleJWTError();
      if (error.name === "TokenExpiredError")
        error = handleTokenExpiresError(error);

      // Operational, trusted error: send message to client
      if (error.isOperational) {
        res.status(err.statusCode).json({
          status: error.status,
          message: error.message,
        });
      }
      // Programming or other unknown error: don't leak error details
      else {
        res.status(500).json({
          status: "error",
          message: "Something went very wrong.",
        });
      }
      next();
    } else {
      res.status(err.statusCode).render("error", {
        title: "Something went wrong",
        msg: err.message,
      });
    }
  }
};

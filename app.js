const express = require("express");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const path = require("path");
const cookieparser = require("cookie-parser");
const compression = require("compression");
const AppError = require("./Utilities/appErrors");
const globalErrorHandler = require("./Controller/errorController");
const tourRouter = require("./routes/tourRoutes");
const userRouter = require("./routes/userRoutes");
const reviewRouter = require("./routes/reviewRoutes");
const viewRouter = require("./routes/viewRoutes");
const bookingRouter = require("./routes/bookingRoutes");

const app = express();

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

// Serving static files
app.use(express.static(path.join(__dirname, "public")));

// Set security HTTP headers
app.use(helmet({ contentSecurityPolicy: false }));

// Development login
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Limit requests from same Api
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour.",
});
app.use("/api", limiter);

// body parser, reading data from body into req.body
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieparser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      "duration",
      "name",
      "maxGroupSize",
      "difficulty",
      "ratingsAverage",
      "price",
    ],
  })
);

app.use(compression());

//test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// app.get("/api/v1/tours/:id", getAlltours);
// app.post("/api/v1/tours", creatTour);
// app.patch("/api/v1/tours/:id", UpdateTour);
// app.delete("/api/v1/tours/:id", deleteTour);

// Mounting different routes...

// const tourRouter = express.Router();
// const userRouter = express.Router();

// tourRouter
//   .route("/:id")
//   .get(getAlltours)
//   .post(creatTour)
//   .patch(UpdateTour)
//   .delete(deleteTour);

// userRouter.route("/").get(getAllUsers).post(createUser);
// userRouter.route("/:id").get(getUser).patch(updateUser).delete(deleteUser);

app.use("/", viewRouter);
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/Users", userRouter);
app.use("/api/v1/reviews", reviewRouter);
app.use("/api/v1/bookings", bookingRouter);

app.all("*", (req, res, next) => {
  // res.status(404).json({
  //   status: "fail",
  //   message: `Can't find ${req.originalUrl} on this server`,
  // });

  // const err = new Error();
  // err.message = `Can't find ${req.originalUrl} on this server`;
  // err.status = "fail";
  // err.statusCode = 404;

  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;

//npm i eslint eslint-config-prettier eslint-plugin-prettier eslint-config-airbnb eslint-plugin-node eslint-plugin-import eslint-plugin-jsx-a11y eslint-plugin-react --save-dev

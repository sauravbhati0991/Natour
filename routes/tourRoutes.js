const express = require("express");
const tourController = require("./../Controller/tourController");
const authController = require("./../Controller/authController");
const reviewRouter = require("./../routes/reviewRoutes");

const Router = express.Router();

// Router.param("id", tourController.checkID);

// Create a checkbody middleware
// check if body contains the name and price property
// If not, send back 400(bad request)
// Add it to post handler stack

//////////////////////////////////////////////////////////////

// Router.route("/:tourID/reviews").post(
//   authController.protect,
//   authController.restrictTo("user"),s
//   reviewController.createReview
// );
Router.use("/:tourID/reviews", reviewRouter);
Router.route("/top-5-cheap").get(
  tourController.aliastopTours,
  tourController.getAlltours
);
Router.route("/tour-stats").get(tourController.getTourStats);
Router.route("/monthly-plan/:year").get(
  authController.protect,
  authController.restrictTo("admin", "lead-guide", "guide"),
  tourController.getMonthlyPlan
);

Router.route("/")
  .get(tourController.getAlltours)
  .post(
    authController.protect,
    authController.restrictTo("admin", "lead-guide"),
    tourController.creatTour
  );
Router.route("/:id")
  .get(tourController.gettour)
  .patch(
    authController.protect,
    authController.restrictTo("admin", "lead-guide"),
    tourController.UpdateTourImages,
    tourController.resizeTourImages,
    tourController.UpdateTour
  )
  .delete(
    authController.protect,
    authController.restrictTo("admin", "lead-guide"),
    tourController.deleteTour
  );

module.exports = Router;

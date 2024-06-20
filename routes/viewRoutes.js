const express = require("express");
const viewController = require("../Controller/viewsController");
const authController = require("./../Controller/authController");
const bookingController = require("./../Controller/bookingController");

const Router = express.Router();

Router.get(
  "/",
  bookingController.createBookingCheckout,
  authController.isloggedIn,
  viewController.getOverview
);
Router.get("/tour/:slug", authController.isloggedIn, viewController.getTour);
Router.get(
  "/tour/booked/:slug",
  authController.isloggedIn,
  viewController.getBookedTour
);
Router.get("/login", authController.isloggedIn, viewController.getLoginForm);
Router.get("/signup", authController.isloggedIn, viewController.getSignupForm);
Router.get("/me", authController.protect, viewController.getAccount);
Router.get("/my-tours", authController.protect, viewController.getMyTours);
Router.get("/my-reviews", authController.protect, viewController.getMyReviews);
Router.get("/favorites", authController.protect, viewController.getMyFavorites);

Router.post(
  "/submit-user-data",
  authController.protect,
  viewController.updateuserData
);

module.exports = Router;

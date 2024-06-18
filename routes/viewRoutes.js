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
Router.get("/login", authController.isloggedIn, viewController.getLoginForm);
Router.get("/me", authController.protect, viewController.getAccount);
Router.get("/my-tours", authController.protect, viewController.getMyTours);

Router.post(
  "/submit-user-data",
  authController.protect,
  viewController.updateuserData
);

module.exports = Router;

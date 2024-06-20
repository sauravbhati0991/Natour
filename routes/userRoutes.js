const express = require("express");
const userController = require("./../Controller/userController");
const authController = require("./../Controller/authController");
const Router = express.Router();

Router.post("/signup", authController.signup);
Router.post("/login", authController.login);
Router.get("/logout", authController.logout);
Router.post("/forgotPassword", authController.forgetPassword);
Router.patch("/resetPassword/:token", authController.resetPassword);
Router.post("/refresh-token", authController.refreshToken);

Router.use(authController.protect);

Router.patch("/updateMyPassword", authController.updatePassword);
Router.get("/me", userController.getMe, userController.getUser);
Router.patch(
  "/updateMe",
  userController.uploaduserPhoto,
  userController.resizeUserPhoto,
  userController.updateMe
);
Router.delete("/deleteMe", userController.deleteMe);

Router.use(authController.restrictTo('admin", "lead-guide'));

Router.route("/")
  .get(userController.getAllUsers)
  .post(userController.createUser);
Router.route("/:id")
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = Router;

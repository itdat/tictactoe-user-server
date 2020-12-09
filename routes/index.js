const express = require("express");
const router = express.Router();
const passport = require("passport");
const userController = require("./../controllers/userController");

router.route("/register").post(userController.Register);
router.route("/login").post(userController.Login);
//Login with facebook
router.route("/login/facebook").get(passport.authenticate("facebook"));
router.route("/login/facebook/callback").get(
  passport.authenticate("facebook", {
    successRedirect: "/",
    failureRedirect: "https://tictactoe-user.netlify.app/login",
  })
);
//Login with google
router.route("/login/google").get(
  passport.authenticate("google", {
    scope: ["profile"],
  })
);
router.route("/login/google/callback").get(
  passport.authenticate("google", {
    successRedirect: "/",
    failureRedirect: "https://tictactoe-user.netlify.app/login",
  })
);
module.exports = router;

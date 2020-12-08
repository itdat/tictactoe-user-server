const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
//const auth = require("../middleware/auth");
const passport = require("passport");
const validateRegisterInput = require("../validation/register");
const validateLoginInput = require("../validation/login");
//Register
router.post("/register", async (req, res) => {
  const { errors, isValid } = await validateRegisterInput(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }
  const { name, username, password } = req.body;
  try {
    let user = await User.findOne({ username });
    if (user) {
      return res.status(400).json({ msg: "Username already exists" });
    } else {
      const newUser = new User({
        name: name,
        username: username,
        password: password,
      });
      bcrypt.genSalt(10, (err, salt) => {
        if (err) console.error("There was an error", err);
        else {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) console.error("There was an error", err);
            else {
              newUser.password = hash;
              newUser.save().then((user) => {
                res.status(200).json(user);
              });
            }
          });
        }
      });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

//Login
router.post("/login", async (req, res) => {
  const { errors, isValid } = await validateLoginInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  const username = req.body.username;
  const password = req.body.password;
  try {
    let user = await User.findOne({ username });
    if (!user) {
      errors.email = "User not found";
      return res.status(404).json(errors);
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Incorrect password" });
    }
    const payload = {
      id: user.id,
      name: user.name,
    };
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      {
        expiresIn: 3600,
      },
      (err, token) => {
        if (err) console.error("There is some error in token", err);
        else {
          res.json({
            success: true,
            token: `Bearer ${token}`,
          });
        }
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

//Login with Facebook
router.get('/login/facebook', passport.authenticate('facebook'));

router.get('/login/facebook/callback', passport.authenticate('facebook', {
  successRedirect: "/",
  failureRedirect: "/fail"
})
);
module.exports = router;

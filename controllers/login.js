const loginRouter = require("express").Router();
const bcrypt = require("bcrypt");
const User = require("../model/user");
const JWT = require("jsonwebtoken");
const config = require("../utlis/config");

// to create a new user or register a new user
loginRouter.post("/", async (req, res) => {
  // get the user details from the request body
  const { email, password } = req.body;

  //check weather user already registered or not
  const user = await User.findOne({ email });

  // if the user does not exist, return an error
  if (!user) {
    return res.status(401).json({
      message: "user does not exist",
    });
  }

  //check if password is correct
   const isAuthenticated = bcrypt.compare(password, user.passwordHash);

  // if the password is incorrect, return an error
  if (!isAuthenticated) {
    return res.status(401).json({
      message: "password is incorrect",
    });
  }

  // define the payload of the token
  const payload = {
    username: user.username,
    id: user._id,
  };

  // if the password is correct, generate a token
  const token = JWT.sign(payload, config.JWTSecret, { expiresIn: "1h" });

  // send the token as response
  res.status(200).json({
    token,
    username: user.username,
    email: user.email,
  });
});


// export the user router
module.exports = loginRouter;

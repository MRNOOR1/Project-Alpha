const express = require("express");
const { connectToDb } = require("../models/db"); // Ensure you're using the correct method
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { addUser } = require("../models/users"); // Ensure addUser function is correct
const router = express.Router();

router.post("/", async (req, res) => {
  const errors = [];

  // Validate inputs
  if (typeof req.body.username !== "string") req.body.username = "";
  if (typeof req.body.password !== "string") req.body.password = "";
  if (typeof req.body.email !== "string") req.body.email = "";

  req.body.username = req.body.username.trim();
  req.body.email = req.body.email.trim();

  // Check for validation errors
  if (!req.body.username) errors.push("You must provide a username");
  if (req.body.username.length < 3)
    errors.push("Username must be longer than 3 characters");
  if (req.body.username.length > 10)
    errors.push("Username must be shorter than 10 characters");
  if (!req.body.username.match(/^[a-zA-Z0-9]+$/))
    errors.push("Username can only contain letters and numbers");

  if (!req.body.email) errors.push("You must provide an email");
  if (!/\S+@\S+\.\S+/.test(req.body.email)) errors.push("Email must be valid");

  if (!req.body.password) errors.push("You must provide a password");
  if (req.body.password.length < 8)
    errors.push("Password must be longer than 8 characters");
  if (req.body.password.length > 70)
    errors.push("Password must be shorter than 70 characters");

  // Connect to the database
  const db = await connectToDb();
  const usersCollection = db.collection("users");

  // Check if username is already taken
  const usernameCheck = await usersCollection.findOne({
    username: req.body.username,
  });
  if (usernameCheck) errors.push("Username is already taken");

  // Check if email is already taken
  const emailCheck = await usersCollection.findOne({ email: req.body.email });
  if (emailCheck) errors.push("Email is already taken");

  if (errors.length) {
    return res.render("index", { errors }); // or use res.json(errors) if you prefer a JSON response
  }

  // Hash password
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(req.body.password, salt);

  try {
    // Insert new user into MongoDB using the addUser function
    await addUser(req.body.username, req.body.email, hashedPassword); // Ensure addUser is async
  } catch (err) {
    errors.push("Error creating the user.");
    return res.render("index", { errors }); // or res.json(errors)
  }

  // Create JWT token
  const token = jwt.sign(
    {
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24, // Token expires in 24 hours
      username: req.body.username,
    },
    process.env.JWTSECRET
  );

  // Send cookie with JWT token
  res.cookie("cookie", token, {
    httpOnly: true,
    secure: true, // Set to false in development without HTTPS
    sameSite: "strict",
    maxAge: 1000 * 60 * 60 * 24, // Cookie expires in 24 hours
  });

  res.redirect("/"); // Redirect to home or another page after successful registration
});

module.exports = router;

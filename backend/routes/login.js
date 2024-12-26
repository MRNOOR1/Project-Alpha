const express = require("express");
const { connectToDb } = require("../models/db"); 
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = express.Router();

router.get("/", (req, res) => {
  res.render("login");
});

router.post("/", async (req, res) => {
  let errors = [];

  if (typeof req.body.username !== "string") req.body.username = "";
  if (typeof req.body.password !== "string") req.body.password = "";

  if (req.body.username.trim() === "" || req.body.password.trim() === "") {
    errors = ["Invalid username or password"];
  }

  if (errors.length) {
    return res.render("login", { errors });
  }
  // Connect to the database
  const db = await connectToDb();
  const usersCollection = db.collection("users");

  // Fetch user by username
  const userInQuestion = await usersCollection.findOne({
    username: req.body.username,
  });

  if (!userInQuestion) {
    errors = ["Invalid username or password"];
    return res.render("login", { errors });
  }

  // Compare the password with the hashed password in the database
  const match = bcrypt.compareSync(req.body.password, userInQuestion.password);
  if (!match) {
    errors = ["Invalid username or password"];
    return res.render("login", { errors });
  }

  // Generate JWT token
  const token = jwt.sign(
    {
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24, // Token expires in 24 hours
      userid: userInQuestion._id, // MongoDB uses _id as the unique identifier
      username: userInQuestion.username,
    },
    process.env.JWTSECRET
  );

  res.cookie("cookie", token, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 1000 * 60 * 60 * 24, // Cookie expires in 24 hours
  });

  res.redirect("/");
});

module.exports = router;

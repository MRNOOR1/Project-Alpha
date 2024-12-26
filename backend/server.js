require("dotenv").config();
const express = require("express");
const app = express();
const db = require("./models/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieparser = require("cookie-parser");
const sanitizeHTML = require("sanitize-html");
const { decodeCookie, mustBeLoggedIn } = require("./middleware/auth");
const login = require("./routes/login");
const register = require("./routes/register");

//databsse
const { createUsersCollection } = require("./models/users");
const { createProjectsCollection } = require("./models/projects");
const { createTasksCollection } = require("./models/tasks");
const { createCommentsCollection } = require("./models/comments");
const { createTaskAssignmentsCollection } = require("./models/taskAssignments");

createUsersCollection();


// end
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));
app.use(cookieparser());

app.use(decodeCookie);

app.use(function (req, res, next) {
  res.locals.errors = [];
  next();
});

app.get("/", (req, res) => {
  if (req.user) {
    return res.render("dashboard");
  } else {
    res.render("index");
  }
});

app.use("/login", login);

app.use("/register", register);

app.get("/logout", (req, res) => {
  res.clearCookie("cookie");
  res.redirect("/");
});

app.listen(3000);

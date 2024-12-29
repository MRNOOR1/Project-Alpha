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
const addProjectsRouter = require("./services/addProjects");
const Projects = require("./routes/projects");

// Database setup
const { createUsersCollection } = require("./models/users");
const {
  createProjectsCollection,
  getProjectsByUser,
  getProjectById,
} = require("./models/projects");
const { createTasksCollection } = require("./models/tasks");
const { createCommentsCollection } = require("./models/comments");
const { createTaskAssignmentsCollection } = require("./models/taskAssignments");

createUsersCollection();
createProjectsCollection();

// Set up view engine and middlewares
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));
app.use(cookieparser());

app.use(decodeCookie);

// Middleware to initialize errors array for each response
app.use(function (req, res, next) {
  res.locals.errors = [];
  next();
});

// Routes
app.get("/", async (req, res) => {
  if (req.user) {
    // Fetch projects only if user is logged in
    const projects = await getProjectsByUser(req.user.userid);
    return res.render("dashboard", { projects });
  } else {
    res.render("index");
  }
});

app.use("/login", login);
app.use("/register", register);

// Logout route
app.get("/logout", (req, res) => {
  res.clearCookie("cookie");
  res.redirect("/");
});

// Protect all routes after this with mustBeLoggedIn middleware
app.use(mustBeLoggedIn);
app.use("/addProjects", addProjectsRouter);
app.use("/projects", Projects);

app.listen(3000);

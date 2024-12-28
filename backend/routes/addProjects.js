const express = require("express");
const { addProject, getProjectsByUser } = require("../models/projects");
const { mustBeLoggedIn, authenticateUser } = require("../middleware/auth");
const router = express.Router();

router.use(mustBeLoggedIn);
// Route to render the form
router.get("/", (req, res) => {
  res.render("add-projects");
});

// Route to add a new project
router.post("/", authenticateUser, async (req, res) => {
  const { name, description } = req.body; // No longer expecting `userId` in the body

  const errors = [];

  const userId = req.userId; // Extract the userId from the authenticated user's session

  // Validate inputs
  if (!name || typeof name !== "string" || name.trim() === "") {
    errors.push("Project name is required and must be a non-empty string.");
  }

  if (errors.length) {
    return res.status(400).json({ errors }); // Respond with validation errors
  }

  try {
    // Add the project to the database
    await addProject(name.trim(), description?.trim() || "", userId);
    res.redirect("/"); // Redirect to the dashboard page
  } catch (error) {
    console.error("Error adding project:", error);
    res
      .status(500)
      .json({ error: "An error occurred while adding the project." });
  }
});

module.exports = router;

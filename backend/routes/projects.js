const express = require("express");
const router = express.Router();
const { mustBeLoggedIn } = require("../middleware/auth");
const { getProjectsByUser, getProjectById } = require("../models/projects");

router.get("/", async (req, res) => {
  const projects = await getProjectsByUser(req.user.userid);
  return res.render("allProjects", { projects });
});

router.get("/:id", mustBeLoggedIn, async (req, res) => {
  const projectId = req.params.id;
  console.log("Project ID:", projectId);

  try {
    const project = await getProjectById(projectId);
    if (!project) {
      return res.status(404).send("Project not found.");
    }
    res.render("project", { project });
  } catch (error) {
    console.error("Error fetching project:", error.message, error.stack);
    res.status(500).send("An error occurred while fetching the project.");
  }
});

module.exports = router;

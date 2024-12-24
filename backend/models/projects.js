const { connectToDb } = require("./db");

// Function to create the 'projects' collection and ensure indexes
async function createProjectsCollection() {
  const db = await connectToDb();
  const projectsCollection = db.collection("projects");

  // Ensure an index on the `created_by` field for faster lookups
  await projectsCollection.createIndex({ created_by: 1 });

  console.log("Projects collection is set up.");
}

// Function to add a project to the 'projects' collection
async function addProject(name, description, createdBy) {
  const db = await connectToDb();
  const projectsCollection = db.collection("projects");

  // Insert project document into the 'projects' collection
  const result = await projectsCollection.insertOne({
    name,
    description,
    created_by: createdBy, // Reference to the user who created this project
    created_at: new Date(), // Automatically set the current timestamp
  });

  console.log("Project added successfully:", result.insertedId);
  return result.insertedId;
}

// Function to retrieve projects by user
async function getProjectsByUser(userId) {
  const db = await connectToDb();
  const projectsCollection = db.collection("projects");

  // Find projects created by a specific user
  const projects = await projectsCollection
    .find({ created_by: userId })
    .toArray();
  return projects;
}

module.exports = { createProjectsCollection, addProject, getProjectsByUser };
